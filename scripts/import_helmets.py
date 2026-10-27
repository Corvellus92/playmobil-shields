#!/usr/bin/env python3
"""Import PlaymoDB hard headwear paginated catalog.
Uses real HTML links / labels; never invents part numbers or image URLs.
"""
import json,re,time,urllib.parse,urllib.request
from pathlib import Path
from html.parser import HTMLParser
BASE='https://playmodb.org'
DEST=Path('helmets-catalog.json')
class Extract(HTMLParser):
 def __init__(self):
  super().__init__();self.rows=[];self.row=None;self.cell=None;self.anchor=None;self.images=[];self.links=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='tr':self.row={'texts':[],'links':[],'images':[]}
  if t in ('td','th') and self.row is not None:self.cell=''
  if t=='a':self.anchor=d.get('href','')
  if t=='img' and self.row is not None:
   u=d.get('src','')
   if u:self.row['images'].append(u)
 def handle_data(self,x):
  if self.cell is not None:self.cell+=x
 def handle_endtag(self,t):
  if t in ('td','th') and self.cell is not None and self.row is not None:
   self.row['texts'].append(' '.join(self.cell.split()));self.cell=None
  if t=='tr' and self.row is not None:self.rows.append(self.row);self.row=None
  if t=='a':self.anchor=None
 # anchor association is captured via parsing text in rows in next iteration
def fetch(page):
 query=urllib.parse.urlencode({'sortby':'description,partnum','page':page,'category':'Wearable-Headwear,Hard','pics':'on'})
 url=BASE+'/cgi-bin/category.pl?'+query
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Accept':'text/html'})
 with urllib.request.urlopen(req,timeout=28) as f:return f.read().decode('utf-8','replace')
class Table(HTMLParser):
 def __init__(self):
  super().__init__();self.rows=[];self.row=None;self.in_td=False;self.in_anchor=False;self.anchor_url='';self.buf=''
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='tr':self.row={'cells':[],'images':[],'links':[]}
  if t in ('td','th') and self.row is not None:self.in_td=True;self.buf=''
  if t=='a':self.in_anchor=True;self.anchor_url=d.get('href','')
  if t=='img' and self.row is not None and d.get('src'):self.row['images'].append(urllib.parse.urljoin(BASE,d['src']))
 def handle_data(self,data):
  if self.in_td:self.buf+=data
  if self.in_anchor and self.row is not None and data.strip():
   self.row['links'].append((self.anchor_url,' '.join(data.split())))
 def handle_endtag(self,t):
  if t in ('td','th') and self.row is not None and self.in_td:self.row['cells'].append(' '.join(self.buf.split()));self.in_td=False
  if t=='a':self.in_anchor=False
  if t=='tr' and self.row is not None:self.rows.append(self.row);self.row=None
def main():
 old={}
 if DEST.exists():
  try:old={x['id']:x for x in json.loads(DEST.read_text()).get('items',[]) if x.get('id')}
  except Exception:pass
 items=dict(old);successful=0;errors=[];samples=[]
 for page in range(1,24):
  try:
   html=fetch(page);p=Table();p.feed(html);added=0
   if page in (1,2):samples.append({'page':page,'htmlLength':len(html),'rows':len(p.rows),'firstRows':[{'cells':r['cells'][:5], 'links':r['links'][:3], 'images':r['images'][:2]} for r in p.rows[:12]]})
   for row in p.rows:
    # Require a part-detail link; do not turn navigation links into inventory items.
    # PlaymoDB displays numbers both as links and as ordinary table text.
    raw=' | '.join(row['cells'])
    numbers=re.findall(r'(?<![0-9])(?:[0-9]{2}[ -]?[0-9]{2}[ -]?[0-9]{4}|[0-9]{8}|[pk][0-9]{3,7})(?![0-9])',raw,re.I)
    partlinks=[(url,label) for url,label in row['links'] if 'showpart.pl' in url.lower() or 'partnum=' in url.lower()]
    if not numbers and not partlinks:continue
    link,label=partlinks[0] if partlinks else ('','')
    fromlink=re.search(r'partnum=([^&]+)',link,re.I)
    candidate=numbers[0] if numbers else urllib.parse.unquote_plus(fromlink.group(1)) if fromlink else ''
    part=re.sub(r'[\\s-]+','',candidate)
    if not re.fullmatch(r'(?:[0-9]{8}|[pk][0-9]{3,7})',part,re.I):continue
    desc=next((c for c in row['cells'] if c and c.strip()!=candidate.strip() and c.strip()!=part and len(c)>4 and not c.isdigit()),'')
    image=next((url for url in row['images'] if 'blank' not in url.lower()),'')
    source=urllib.parse.urljoin(BASE+'/','/cgi-bin/showpart.pl?partnum='+urllib.parse.quote(part)) if not link else urllib.parse.urljoin(BASE+'/',link)
    key='playmodb:'+part
    items[key]={'id':key,'part':part,'name':desc or part,'type':'Other','image':image,'source':source,'category':'helmets'}
    added+=1
   successful+=1;print('Page',page,'rows',len(p.rows),'part candidates',added)
  except Exception as exc:errors.append({'page':page,'error':str(exc)[:200]});print('FAILED page',page,str(exc)[:160])
  time.sleep(.2)
 payload={'source':BASE+'/cgi-bin/category.pl?category=Wearable-Headwear%2CHard','pagesAttempted':23,'pagesSucceeded':successful,'status':'ok' if successful==23 else 'partial','errors':errors,'parserSamples':samples,'items':list(items.values())}
 payload['itemsFound']=len(items)
 payload['diagnostic']='No parts returned; check errors and HTML parsing' if not items else 'Items returned'
 DEST.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 if not items:print('No verified items; diagnostic JSON written to explain why')
 print('Total parts:',len(items),'pages:',successful,'errors:',len(errors))
if __name__=='__main__':main()
