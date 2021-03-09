
let express = require("express");
var xmlparser = require('express-xml-bodyparser');
// let bodyParser = require('body-parser');
import { js2xml, xml2js } from "xml-js";
import { getSignature, decrypt, encrypt } from '@wecom/crypto';
let app = express();
app.use(xmlparser());

const token = "";
const encodingAESKey = "";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

app.get('/wework/callback', (req, res) => {
    console.log(req.query);
    var params: object = req.query;
    const signature = getSignature(token, params["timestamp"], params["nonce"], params["echostr"]);

    if (signature != params["msg_signature"]) {
        console.log("signature", signature);
        console.warn("signature != msg_signature");
        res.send("error");
    }
    else {
        const { message } = decrypt(encodingAESKey, params["echostr"]);
        console.log("message", message);
        res.send(message);
    }
});

app.post('/wework/callback', (req, res) => {
    const params = req.body.xml;
    console.log(params);
    const { message, id } = decrypt(encodingAESKey, params["encrypt"][0]);

    let obj: object = xml2js(message, {compact:true, ignoreComment: true, alwaysChildren: true});

    console.log("get message", obj);

    let resp: any = {
        xml: {
            "ToUserName": {"_cdata":"ToUserName"},
            "FromUserName": {"_cdata":"FromUserName"},
            "CreateTime": 1357290913,
            "MsgType": {"_cdata": "update_taskcard"},
            "TaskCard": {
                "ReplaceName": {"_cdata": "replace_name"}
            }
        }
    }

    console.log("real resp: ", resp);
    let xmlData = js2xml(resp, {compact: true});
    console.log("xmlData: ", xmlData);

    const ciphered = encrypt(encodingAESKey, xmlData, id);

    let timestamp = Date.now();

    let nonce = getRandomInt(100000000);

    const signature = getSignature(token, timestamp, nonce, ciphered);

    resp = {
        xml: {
            TimeStamp: timestamp,
            Nonce: nonce,
            MsgSignature: {"_cdata": signature},
            Encrypt: {"_cdata": ciphered}
        }
    }

    let xmlResp = js2xml(resp, {compact: true});
    console.log("xmlResp: ", xmlResp);

    setTimeout(() => {
        res.send(xmlResp);
    }, 0);
});

app.listen(8080);
