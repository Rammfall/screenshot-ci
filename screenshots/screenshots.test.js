const puppeteer = require('puppeteer');

const resolutions = require('./config/resolutions');
const { pages, url } = require('./config/pages');
const scroll = require('./utils/scrollAllPage');

describe.each(pages)('Page %p',  (currentPage) => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto(`${url}/${currentPage}`);
  });

  test.each(resolutions)('Test screenshot on %i width, height %i > %s', async (width, height, resolution) => {
    await page.setViewport({
      width,
      height
    });
    await scroll(page);
    const image = await page.screenshot({fullPage: true});

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `./screenshots/__snapshots__/${currentPage}`,
      customDiffDir: `./screenshots/__snapshots__/${currentPage}/diffs`,
      customSnapshotIdentifier: `${resolution}-${width}`
    });
  });

  afterAll(async () => {
    await browser.close();
  })
});
