#!/usr/bin/env python3
"""Best-effort image catalog from Animobil's public shield index.
No guessed image filenames: only paths found in downloaded HTML are emitted.
"""
import json, re, time, urllib.request
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

BASE='https://animobil.info/shields/'
INDEX=BASE+'text/wit-toc.html'
class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        for key in ('src','href'):
            if attrs.get(key): self.urls.append(attrs[key])

def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; PlaymobilShieldsCollector/1.0)'})
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read().decode('utf-8','replace')

def collect():
    urls=[INDEX]
    # The known shield photo remains usable if Animobil blocks requests.
    images={'30038545': {'https://animobil.info/shields/wit-icons/30038545-30822346a.png'}}
    visited=set()
    errors=[]
    while urls and len(visited)<550:
        url=urls.pop(0)
        if url in visited: continue
        visited.add(url)
        try: raw=get(url)
        except Exception as exc:
            errors.append(str(exc)[:160]+' at '+url)
            continue
        parser=Parser(); parser.feed(raw)
        for path in parser.urls:
            u=urljoin(url,path)
            parsed=urlparse(u)
            if parsed.netloc not in ('animobil.info','www.animobil.info'):continue
            if '/shields/wit-icons/' in parsed.path and re.search(r'\.(png|jpe?g|webp)$',parsed.path,re.I):
                name=parsed.path.rsplit('/',1)[-1]
                m=re.match(r'^(\d{8})-',name)
                if m:
                    part=m.group(1)
                    images.setdefault(part,set()).add('https://animobil.info'+parsed.path)
            if parsed.path.startswith('/shields/text/') and parsed.path.endswith('.html') and u not in visited and u not in urls:
                urls.append(u)
        time.sleep(.12)
    return {k:sorted(v) for k,v in sorted(images.items())},len(visited),errors

if __name__=='__main__':
    images,count,errors=collect()
    path=Path('animobil-images.json')
    if path.exists():
        try:
            old=json.loads(path.read_text(encoding='utf-8'))
            for part,links in old.get('imageMap',{}).items():
                if re.fullmatch(r'\\d{8}',part) and isinstance(links,list):
                    images.setdefault(part,[])
                    images[part]=sorted(set(images[part])|{link for link in links if isinstance(link,str) and link.startswith('https://animobil.info/shields/wit-icons/')})
        except (OSError,ValueError,TypeError) as exc:
            print('Previous catalog could not be loaded:',exc)
    data={'source':INDEX,'imageMap':images,'pagesScanned':count,
          'status':'partial' if errors else 'ok',
          'errorCount':len(errors)}
    path.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\\n',encoding='utf-8')
    print('Image keys:',len(images),'pages:',count,'errors:',len(errors),
          'status:',data['status'])
    if errors: print('First scrape error:',errors[0])
