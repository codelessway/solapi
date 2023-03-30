const { SolapiMessageService } = require('solapi');
const express = require('express')
const app = express()
const port = 3000

app.get('/data', (req, res) => {
    console.log("inside /data route");
  res.send('Hello World!')
})

app.post('/payload', (req, res) => {
  console.log(req.body);
  res.send(res.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



function sendMessage(to,from,pfid,templateId){

  const messageService = new SolapiMessageService("NCSYQZXVPTEA5W5T", "TQRTJ0PHF62FNFYHFFTAEADA6ME5TFWI");

// 반드시 발신번호와 수신번호는 01012345678 형식으로 입력해주세요!
messageService.send({
  "to": "010-3381-3069",
  "from": "010-9571-6736",
  "kakaoOptions": {
    "pfId": "KA01PF2303150547448974jVhP14CJV5",
    "templateId": "KA01TP230315073806460ao9PScCLNWu",
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
}).then((res)=>{
return res;
});
}
