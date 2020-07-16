const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
})

test('The header has a correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
    const id = '5eff22e48f1c8061f05b8ffc';

    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };
    const sessionString = Buffer
        .from(JSON.stringify(sessionObject))
        .toString('base64');
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign(`session=${sessionString}`);

    await page.setCookie({
        name: 'session',
        value: sessionString
    });
    await page.setCookie({
        name: 'session.sig',
        value: sig
    });
    await page.goto('localhost:3000');

    const logoutButton = 'a[href="/auth/logout"]';
    await page.waitFor(logoutButton);

    const text = await page.$eval(logoutButton, el => el.innerHTML);
    expect(text).toEqual('Logout');
});
