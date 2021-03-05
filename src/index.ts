
let express = require("express");
var xmlparser = require('express-xml-bodyparser');
// let bodyParser = require('body-parser');
import { js2xml, xml2js } from "xml-js";
import { getSignature, decrypt, encrypt } from '@wecom/crypto';
import { randomInt } from "crypto";
let app = express();
app.use(xmlparser());

const token = "";
const encodingAESKey = "";

app.get('/wework/callback', (req, res) => {
    console.log(req.query);
    var params:object = req.query;
    const signature = getSignature(token, params["timestamp"], params["nonce"], params["echostr"]);

    res.send(signature);
});

app.post('/wework/callback', (req, res) => {
    console.log(req.data);
    const {message, id} = decrypt(encodingAESKey, req.data["Encrypt"]);

    let obj: object = xml2js(message);

    console.log(obj);

    let resp: any = {
        "ToUserName": "",
        "FromUserName": "fromUser",
        "CreateTime": 1357290913,
        "MsgType": "update_taskcard",
        "TaskCard": {
            "ReplaceName": "replace_name"
        }
    }

    let xmlData = js2xml(resp);

    const ciphered = encrypt(encodingAESKey, xmlData, id);

    let timestamp = Date.now();

    let nonce = randomInt(1000000);

    const signature = getSignature(token, timestamp, nonce, ciphered);

    resp = {
        TimeStamp: timestamp,
        Nonce: nonce,
        MsgSignature: signature,
        Encrypt: ciphered
    }
    
    res.send(resp);
});

app.listen(3000);