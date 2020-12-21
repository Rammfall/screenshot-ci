const puppeteer = require('puppeteer');

const resolutions = require('./config/resolutions');
const { pages, url } = require('./config/pages');

describe('Screenshots tests', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  describe.each(pages)('Page %p', ( currentPage ) => {
    let page;

    console.log(`On page ${currentPage}`);
    beforeAll(async () => {
      page = await browser.newPage();

      await page.goto(`${url}/${currentPage}`);
    });

    test.each(resolutions)('Test screenshot on %i width, height %i > %s', async ( width, height, resolution ) => {
      await page.setViewport({
        width,
        height
      });

      console.log(`In resolution ${resolution}`);
      const image = await page.screenshot({ fullPage: true });

      expect(image).toMatchImageSnapshot({
        customSnapshotsDir: `./screenshots/__snapshots__/${currentPage}`,
        customDiffDir: `./screenshots/__snapshots__/${currentPage}/diffs`,
        customSnapshotIdentifier: `${resolution}-${width}`
      });
      console.log(`done in resolution ${resolution}`);
    });

    afterAll(async () => {
      await page.close();
    })
  });

  afterAll(async () => {
    await browser.close();
  })
});
