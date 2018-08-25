const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
const fs = require('fs');

(async () => {
  // capture screenshots
  const url = 'https://ngyv.github.io/screenshot-example/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await Promise.all(Array(15).fill(0).map((_, index) => page.screenshot({path: `screenshots/test-${index}.png`})));
  await browser.close();




  // encode into gif
  let encoder = new GIFEncoder(600, 600);
  encoder.createReadStream().pipe(fs.createWriteStream('i-guess.gif'));

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(150);
  encoder.setQuality(15);

  let canvas = new Canvas(600, 600);
  let ctx = canvas.getContext('2d');

  // blue rectangle frame
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 600, 600);
  encoder.addFrame(ctx);

  // image frame
  Array(15).fill(0).forEach((_, index) => {
    let data = fs.readFileSync(`screenshots/test-${index}.png`);
    let img = new Canvas.Image;
    img.src = data;
    ctx.drawImage(img, 0, 0, 600, 600);
    encoder.addFrame(ctx);
  });

  encoder.finish();
})();
