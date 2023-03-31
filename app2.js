const { SolapiMessageService } = require('solapi');
const express = require('express');
const bodyParser = require('body-parser');

//for ss
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express()
const port = 3000

app.use(bodyParser.json());

// Serve the contents of the "images" directory as static files
app.use('/images', express.static('images'));

app.get('/data', (req, res) => {
    console.log("inside /data route");
  res.send('Hello World!')
})

 app.post('/sendKakaoFriendTalk', async (req, res) => {
  const { to, from, pfId, templateId } = req.body;
  //console.log(to +" "+from+" "+pfId +" "+templateId);
  // "to": "010-3381-3069",
  // "from": "010-9571-6736",
  // "kakaoOptions": {
  //   "pfId": "KA01PF2303150547448974jVhP14CJV5",
  //   "templateId": "KA01TP230315073806460ao9PScCLNWu",

  // const to1="010-3381-3069";
  // const from1 = "010-9571-6736";
  // const pfId1 ="KA01PF2303150547448974jVhP14CJV5";
  // const templateId1 = "KA01TP230315073806460ao9PScCLNWu";


  let  response =  await sendMessage(to,from,pfId,templateId);

  res.json(response);
});


// take SS
app.post('/takeSS', async (req, res) => {
  console.log("route takess called");

  await deleteFiles();
  
  const { url } = req.body;
  let ss =await takeScreenshot(url,getBaseUrl(req));
  console.log(ss);
  res.json({"url":ss});
});

//start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



async function sendMessage(to,from,pfId,templateId){

  const messageService = new SolapiMessageService("NCSYQZXVPTEA5W5T", "TQRTJ0PHF62FNFYHFFTAEADA6ME5TFWI");

// 반드시 발신번호와 수신번호는 01012345678 형식으로 입력해주세요!
return await messageService.send({
  "to": to,
  "from": from,
  "kakaoOptions": {
    "pfId": pfId,
    "templateId": templateId,
    // 치환문구가 없을 때의 기본 형태
    "variables": {}

    // 치환문구가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
    /*
    variables: {
      "#{변수명}": "임의의 값"
    }
    */

    // disbaleSms 값을 true로 줄 경우 문자로의 대체발송이 비활성화 됩니다.
    // disableSms: true,
  }
})


}


/*
const puppeteer = require('puppeteer');

async function takeScreenshot(url) {
  // Launch a new browser instance
  const browser = await puppeteer.launch();

  // Open a new page in the browser
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(url);

  // Take a screenshot of the page
  const screenshot = await page.screenshot({fullPage: true});

  // Close the browser
  await browser.close();

  // Return the URL of the screenshot as a data URL
  return `data:image/png;base64,${screenshot.toString('base64')}`;
}

// Example usage
takeScreenshot('https://www.google.com').then((url) => {
  console.log(url);
});
*/



async function takeScreenshot(url, baseUrl) {
  // Launch headless Chromium browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


    // Set viewport and window size
    await page.setViewport({
      width: 1080,
      height: 1080
    });
  // Navigate to URL and wait for page to load
  await page.goto(url, {waitUntil: 'networkidle2'});

  // Capture screenshot of page
 // const screenshot = await page.screenshot({fullPage: true});

  
  // Take screenshot
  const screenshot= await page.screenshot({
    path: 'screenshot.png',
    clip: {
      x: 0,
      y: 0,
      width: 1080,
      height: 1080
    }
  });

  // Close browser
  await browser.close();

  // Generate filename for screenshot image
  const filename = Date.now() + '.png';

  // Save screenshot image to /images directory
  const imagePath = path.join(__dirname, 'images', filename);
  fs.writeFileSync(imagePath, screenshot);

  // Return public URL to screenshot image
  const publicUrl = `${baseUrl}/images/${filename}`;
  console.log(publicUrl);
  return publicUrl;
}


// // Example usage
// takeScreenshot('https://www.facebook.com','your base url')
//   .then(publicUrl => {
//     console.log('Screenshot saved to:', publicUrl);
//   })
//   .catch(error => {
//     console.error('Error taking screenshot:', error);
//   });


  app.get('/', (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.send(`Base URL: ${baseUrl}`);
  });

  function getBaseUrl(req) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}`;
  }

  //
  async function deleteFiles(){
    const directory = './images';

    // Read directory
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      
      // Sort files by modification time (oldest to newest)
      files.sort((a, b) => {
        return fs.statSync(directory + '/' + a).mtime.getTime() - fs.statSync(directory + '/' + b).mtime.getTime();
      });
      
      // Delete all but the last 5 files
      const filesToDelete = files.slice(0, -5);
      filesToDelete.forEach((file) => {
        fs.unlink(directory + '/' + file, (err) => {
          if (err) throw err;
          console.log('Deleted file:', file);
        });
      });
    });

  }