const { SolapiMessageService } = require('solapi');
const express = require('express');
const {chromium} = require("playwright");
const url = require("url");

const app = express()
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
    console.log("solapi app is running");
  res.send('solapi app is running');
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


  let  response =  await sendMessage(to,from,pfId,templateId).then((r)=>{  console.log("message sent");  res.json(r);  }).catch((e)=>{ res.json(e); });;
 
});


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
});

}


app.post("/takeScreenshot", async (req, res) => {
  const {urlString,width, height} = req.body;

  if (!urlString || !width || !height) {
    return res.status(400).json({message: "Missing parameters"});
  }


  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({width, height});
  await page.goto(urlString);
  // Wait for the page to finish loading
  await page.waitForLoadState('networkidle0');
   // Wait an additional 10 seconds
   //await new Promise(resolve => setTimeout(resolve, 10000));

  const screenshot = await page.screenshot();
  await browser.close();

  const {hostname} = url.parse(urlString);
  const fileName = `${hostname}-screenshot-${Date.now()}.png`;
  res.setHeader("Content-Type", "image/png");
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  
  res.json({
    fileName,
    screenshot: screenshot
  });
  
  console.log(screenshot);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
