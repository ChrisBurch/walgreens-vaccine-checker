// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    // hack to get console.log to work
    page.on('console', consoleObj => console.log(consoleObj.text()));

    // need to load up this page first to get the required cookies, otherwise loading /location-screening fails
    await page.goto('https://www.walgreens.com/findcare/vaccination/covid-19/');

    // load the page
    await page.goto('https://www.walgreens.com/findcare/vaccination/covid-19/location-screening');

    // find an <input> tag with id="inputLocation" and fill in the string "10001"
    await page.$eval('input[id=inputLocation]', el => el.value = '10001');
    await page.screenshot({path: 'screenshot1.png'});
    console.log("submitting form!")

    // Submit form
    await page.evaluate(() => {
        console.log("clicking submit")
        document.querySelector('.LocationSearch_container > div > span > button').click();
        console.log("clicked!")
    });
    console.log("submitted form")

    // Wait for search results page to load
    await page.waitForSelector('.alert');
    //document.querySelector("#alert")

    await page.screenshot({path: 'screenshot2.png'});
    await browser.close();
})