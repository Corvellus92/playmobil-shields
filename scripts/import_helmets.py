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
def fetch(page, category='Wearable-Headwear,Hard'):
 query=urllib.parse.urlencode({'sortby':'description,partnum','page':page,'category':category,'pics':'on'})
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
class LineupParser(HTMLParser):
 def __init__(self):
  super().__init__();self.entries=[];self.current=None;self.depth=0;self.field=None
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs);classes=attrs.get('class','').split()
  if tag=='div' and 'lineup' in classes and self.current is None:
   self.current={'part':'','name':'','image':'','source':'','color':''};self.depth=1;self.field=None;return
  if self.current is None:return
  if tag=='div':
   self.depth+=1
   if 'listpartnumber' in classes:self.field='part'
   elif 'listpartname' in classes:self.field='name'
  elif tag=='a' and 'showpart.pl' in attrs.get('href','') and not self.current['source']:
   self.current['source']=urllib.parse.urljoin(BASE,attrs['href'])
  elif tag=='img':
   src=attrs.get('src','')
   if '/parts/' in src and not self.current['image']:self.current['image']=urllib.parse.urljoin(BASE,src)
  elif tag=='small':self.field='color'
 def handle_data(self,data):
  if self.current is not None and self.field:
   self.current[self.field]+=data
 def handle_endtag(self,tag):
  if self.current is None:return
  if tag=='small':self.field=None
  if tag=='div':
   self.depth-=1;self.field=None
   if self.depth==0:
    self.entries.append(self.current);self.current=None

def main():
 old={}
 if DEST.exists():
  try:old={x['id']:x for x in json.loads(DEST.read_text()).get('items',[]) if x.get('id')}
  except Exception:pass
 items=dict(old);successful=0;errors=[];samples=[]
 attempted=0
 categoryStats={}
 for category in ('Wearable-Headwear,Hard','Wearable-Headwear,Soft'):
  try:
   first=fetch(1,category)
   total_match=re.search(r'Results:\s*(\d+)\s*parts',first)
   total=int(total_match.group(1)) if total_match else 0
   pages=max(1,(total+49)//50)
  except Exception as exc:
   errors.append({'category':category,'page':1,'error':str(exc)[:200]})
   categoryStats[category]={'pagesSucceeded':0,'pagesAttempted':1}
   attempted+=1
   continue
  ok=0
  attempted+=pages
  for page in range(1,pages+1):
   try:
    html=first if page==1 else fetch(page,category)
    p=LineupParser();p.feed(html)
    for row in p.entries:
     part=' '.join(row['part'].split())
     if not part:continue
     compact=re.sub(r'[^a-zA-Z0-9]','',part)
     if len(compact)<4:continue
     desc=' '.join(row['name'].split())
     source=row['source'] or BASE+'/cgi-bin/showpart.pl?partnum='+urllib.parse.quote(part.replace(' ','-'))
     key='playmodb:'+compact
     entry={'id':key,'part':part,'name':desc or part,'type':'Other','image':row['image'],'source':source,'color':' '.join(row['color'].split()),'category':'helmets','headwearCategory':'Soft' if category.endswith('Soft') else 'Hard'}
     if key not in items or (not items[key].get('image') and entry.get('image')):items[key]=entry
    ok+=1;successful+=1
    print(category,'page',page,'lineups',len(p.entries))
   except Exception as exc:errors.append({'category':category,'page':page,'error':str(exc)[:200]})
   time.sleep(.2)
  categoryStats[category]={'pagesSucceeded':ok,'pagesAttempted':pages,'reportedParts':total}
 payload={'source':BASE+'/cgi-bin/category.pl?category=Wearable-Headwear%2CHard','pagesAttempted':attempted,'pagesSucceeded':successful,'categoryStats':categoryStats,'status':'ok' if successful==attempted else 'partial','errors':errors,'parserSamples':samples,'items':list(items.values())}
 payload['itemsFound']=len(items)
 payload['diagnostic']='No parts returned; check errors and HTML parsing' if not items else 'Items returned'
 DEST.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 if not items:print('No verified items; diagnostic JSON written to explain why')
 print('Total unique parts:',len(items),'pages:',successful,'/',attempted,'errors:',len(errors))
if __name__=='__main__':main()
