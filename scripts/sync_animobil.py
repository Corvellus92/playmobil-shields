#!/usr/bin/env python3
"""Best-effort image catalog from Animobil's public shield index.
No guessed image filenames: only paths found in downloaded HTML are emitted.
"""
import json, re, time, urllib.request
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
    visited=set()
    images={}
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
    if not images:
        raise SystemExit('No images collected; keeping existing data untouched. Pages='+str(count)+' errors='+str(errors[:3]))
    with open('animobil-images.json','w',encoding='utf-8') as f:
        json.dump({'source':INDEX,'imageMap':images,'pagesScanned':count},f,indent=2)
    print('Validated part keys:',len(images),'pages:',count,'errors:',len(errors))
