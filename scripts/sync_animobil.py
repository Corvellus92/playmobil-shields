#!/usr/bin/env python3
"""Sync exact Animobil shield image URLs, preserving prior verified mappings."""
import json
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

ROOT = 'https://animobil.info'
INDEX = ROOT + '/shields/text/wit-toc.html'
KNOWN = {'30038545': ['https://animobil.info/shields/wit-icons/30038545-30822346a.png']}
OUTPUT = Path('animobil-images.json')
CATEGORIES_JS = Path('app.js')
TIMEOUT = 9

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        props = dict(attrs)
        for key in ('src', 'href', 'data-src'):
            if props.get(key):
                self.links.append(props[key])

def fetch(url):
    request = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (compatible; PlaymobilCatalog/1.0)',
        'Accept': 'text/html,application/xhtml+xml'})
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        return response.read().decode('utf-8', errors='replace')

def category_urls():
    urls = {INDEX}
    try:
        text = CATEGORIES_JS.read_text(encoding='utf-8')
        # Categories are a constant JS literal of known Animobil pages.
        urls.update(re.findall(r'https://animobil\.info/shields/text/[^"\s]+\.html', text))
    except OSError as exc:
        print('Cannot read category list:', exc)
    return sorted(urls)

def scan_page(url):
    body = fetch(url)
    parser = Links()
    parser.feed(body)
    urls = set(urljoin(url, unquote(link)) for link in parser.links)
    # Some pages contain image URLs as strings rather than HTML attributes.
    for filename in re.findall(r'\b\d{8}-[A-Za-z0-9_-]+\.(?:png|jpg|jpeg|webp)\b', body, flags=re.I):
        urls.add(ROOT + '/shields/wit-icons/' + filename)
    found = {}
    for absolute in urls:
        parts = urlparse(absolute)
        if parts.netloc not in ('animobil.info', 'www.animobil.info'):
            continue
        if not parts.path.startswith('/shields/wit-icons/'):
            continue
        filename = parts.path.rsplit('/', 1)[-1]
        m = re.fullmatch(r'(\d{8})-[A-Za-z0-9_-]+\.(?:png|jpg|jpeg|webp)', filename, flags=re.I)
        if m:
            found.setdefault(m.group(1), set()).add(ROOT + parts.path)
    return found

def main():
    images = {k: set(v) for k, v in KNOWN.items()}
    if OUTPUT.exists():
        try:
            previous = json.loads(OUTPUT.read_text(encoding='utf-8'))
            for part, links in previous.get('imageMap', {}).items():
                if re.fullmatch(r'\d{8}', part) and isinstance(links, list):
                    images.setdefault(part, set()).update(
                        u for u in links if isinstance(u, str)
                        and u.startswith(ROOT + '/shields/wit-icons/'))
        except (OSError, ValueError, TypeError) as exc:
            print('Previous index unreadable:', exc)
    urls = category_urls()
    errors = []
    successful = 0
    newly_seen = set()
    # Bounded worker pool; avoid serial 9-second timeouts for each category.
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(scan_page, url): url for url in urls}
        for future in as_completed(futures):
            url = futures[future]
            try:
                result = future.result()
                successful += 1
                for part, links in result.items():
                    newly_seen.update(links - images.get(part, set()))
                    images.setdefault(part, set()).update(links)
            except Exception as exc:
                errors.append({'url': url, 'error': str(exc)[:150]})
    payload = {
        'source': INDEX,
        'imageMap': {part: sorted(links) for part, links in sorted(images.items())},
        'pagesScanned': successful,
        'pagesAttempted': len(urls),
        'status': 'ok' if not errors else 'partial',
        'errorCount': len(errors),
        'newImageCount': len(newly_seen),
        'errorsSample': errors[:5]
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Pages OK:', successful, '/', len(urls), '| unique parts:', len(images),
          '| new image links:', len(newly_seen), '| failed:', len(errors))
    if errors:
        print('First error:', errors[0])
        print('PARTIAL SUCCESS: do not interpret green workflow run as full catalog coverage.')

if __name__ == '__main__':
    main()
