"""Real Chromium UI smoke tests. A module bundle is injected because the test sandbox blocks localhost navigation.
The production build still uses plain ES modules and HTTPS/service worker. No real iPhone execution is claimed.
"""
import asyncio
import pathlib
import base64
import re
from playwright.async_api import async_playwright

BASE = pathlib.Path(__file__).resolve().parents[1]


def combined():
    data = (BASE / 'data.js').read_text().replace('export const ', 'const ')
    engine = (BASE / 'engine.js').read_text()
    engine = re.sub(r'^import .*?;\n', '', engine, flags=re.M).replace('export const ', 'const ').replace('export function ', 'function ')
    app = (BASE / 'app.js').read_text()
    app = re.sub(r'^import .*?;\n', '', app, flags=re.M)
    logo = base64.b64encode((BASE / 'assets/compass.svg').read_bytes()).decode('ascii')
    app = app.replace('src="./assets/compass.svg"', f'src="data:image/svg+xml;base64,{logo}"')
    return '\n'.join([data, engine, app])


async def prepare(browser, mobile=False, snapshot=None):
    opts = dict(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':1050},
                is_mobile=mobile, device_scale_factor=2 if mobile else 1, accept_downloads=True)
    page = await browser.new_page(**opts)
    errors=[]
    page.on('pageerror', lambda exc:errors.append(str(exc)))
    page.on('dialog',lambda d:asyncio.create_task(d.accept()))
    html = (BASE / 'index.html').read_text().replace('<script type="module" src="./app.js"></script>','').replace('<link rel="stylesheet" href="./style.css">','')
    await page.set_content(html)
    await page.evaluate("""(initial)=>{
       const store=initial||{};
       Object.defineProperty(window,'localStorage',{configurable:true,value:{
         getItem:(k)=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:null,
         setItem:(k,v)=>{store[k]=String(v)},
         removeItem:(k)=>{delete store[k]}
       }});
       window.__testStore=store;
     }""", snapshot)
    await page.add_style_tag(content=(BASE / 'style.css').read_text())
    await page.add_script_tag(content=combined())
    assert not errors, errors
    return page,errors


async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',
            args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
        desktop,errors=await prepare(browser)
        assert 'Wie geht es dir' in await desktop.locator('.hero h1').inner_text()
        assert await desktop.locator('[data-intent]').count()>=16
        await desktop.screenshot(path=str(BASE/'tests'/'desktop.png'),full_page=True)
        print('PASS desktop home: menu and responsive navigation')

        await desktop.locator('[data-depth="micro"]').click()
        await desktop.locator('[data-start="daily"]').click()
        assert 'fühlst' in (await desktop.locator('.question-card h1').inner_text()).lower()
        await desktop.locator('[data-emotion="ängstlich"]').click()
        await desktop.locator('[data-next="emotions"]').click()
        assert 'intensiv' in (await desktop.locator('.question-card h1').inner_text()).lower()
        await desktop.locator('[data-choose="intensity"][data-value="7"]').click()
        await desktop.locator('[data-next="intensity"]').click()
        assert 'fehlen' in (await desktop.locator('.question-card h1').inner_text()).lower() or 'guttun' in (await desktop.locator('.question-card h1').inner_text()).lower()
        await desktop.locator('[data-next="needs"]').click()
        assert await desktop.locator('[data-summary="compassion"]').count()==1
        print('PASS micro reflection: emotion -> intensity -> needs -> editable summary')
        await desktop.screenshot(path=str(BASE/'tests'/'result.png'),full_page=True)
        assert await desktop.locator('[data-copy-ai]').count()==0
        assert await desktop.locator('[data-record]').count()==0
        assert await desktop.evaluate('Object.keys(window.__testStore).length')>=1 # depth setting; no reflection
        pre=await desktop.evaluate("JSON.parse(window.__testStore['inner-compass-local-v1']).entries.length")
        assert pre==0,pre
        await desktop.locator('[data-save-reflection]').click()
        assert await desktop.locator('[data-record]').count()==1
        assert await desktop.evaluate("JSON.parse(window.__testStore['inner-compass-local-v1']).entries.length")==1
        print('PASS explicit save creates one local record; AI is off')
        stored=await desktop.evaluate('JSON.stringify(window.__testStore)')

        restored,errors2=await prepare(browser,snapshot=__import__('json').loads(stored))
        await restored.locator('[data-nav="records"]').first.click()
        assert await restored.locator('[data-record]').count()==1
        await restored.locator('[data-delete-record]').first.click()
        assert await restored.locator('[data-record]').count()==0
        assert await restored.evaluate("JSON.parse(window.__testStore['inner-compass-local-v1']).entries.length")==0
        print('PASS reload/restore simulation, selective deletion')

        journal,errors3=await prepare(browser)
        await journal.locator('[data-nav="journal"]').first.click()
        assert await journal.locator('[data-journal]').count()>=15
        await journal.locator('[data-journal]').first.click()
        await journal.locator('[data-journal-answer]').fill('Nur ein Entwurf. Nicht speichern.')
        await journal.locator('[data-journal-finish]').click()
        assert await journal.locator('[data-journal-preview]').count()>=1
        await journal.locator('[data-journal-exit]').last.click()
        assert await journal.locator('[data-journal]').count()>=15
        assert await journal.evaluate('Object.keys(window.__testStore).length')==0
        print('PASS journaling: input, preview, discard without persistence')

        mobile,errors4=await prepare(browser,mobile=True)
        assert await mobile.locator('.bottom-nav').is_visible()
        await mobile.screenshot(path=str(BASE/'tests'/'iphone.png'),full_page=True)
        # Check right edge of viewport is not clipped by layout overflow.
        horizontal=await mobile.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
        assert horizontal<=2,f'mobile viewport horizontal overflow: {horizontal}'
        await mobile.locator('[data-start="daily"]').click()
        await mobile.locator('[data-finish]').click()
        await mobile.screenshot(path=str(BASE/'tests'/'iphone-reflection.png'),full_page=True)
        await mobile.locator('[data-discard]').click()
        assert await mobile.locator('.hero').count()==1
        assert await mobile.evaluate('Object.keys(window.__testStore).length')==0
        await mobile.locator('[data-nav="support"]').click()
        assert await mobile.locator('a[href="tel:112"]').count()==1
        assert await mobile.locator('a[href="tel:142"]').count()==1
        print('PASS mobile: viewport, discard, safety access, no implicit storage')

        for ar in (errors,errors2,errors3,errors4):
            assert not ar,ar
        print('PASS: all Chromium UI smoke tests; browser JS errors: zero')
        await browser.close()

if __name__=='__main__':
    asyncio.run(main())
