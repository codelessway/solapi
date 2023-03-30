var crypto = require("crypto");
var axios = require("axios");

var now = new Date().toISOString();
// 16진수 64자의 랜덤 값 생성
var genRanHex = size =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
var salt = genRanHex(64);
var message = now + salt;
var apiKey = "NCSYQZXVPTEA5W5T";
var apiSecret = "TQRTJ0PHF62FNFYHFFTAEADA6ME5TFWI";
var signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");

// 생성한 시그니처를 사용하여 API 호출
var uri = `https://api.solapi.com/messages/v4/list?limit=1`;
axios
  .get(uri, {
    headers: {
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`
    }
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(error => {
    console.log(error.response.data);
  });