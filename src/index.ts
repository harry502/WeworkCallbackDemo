
let express = require("express");
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.post('/api/get_game_backend_info', (req, res) => {
    console.log(req.body.player_id);
    let info = {
            "角色能力(array)": ["瞬间移动","矢量控制","预测未来","再生能力","意念控制"],
            "角色评级": 6,
            "角色评价": "你咋不上天",
            "角色小弟":
            [
                {
                "小弟名称": "小弟1号",
                "小弟能力": ["喊666","背后捅刀","乘乱逃命"]
                },
                {
                "小弟名称": "小弟2号",
                "小弟能力": ["喊666","虚张声势","乘乱逃命"]
                }
            ],
            "角色详情": {
                "战斗力": "无法估量",
                "等级": 999,
                "武器": "左手和右手",
                "座右铭": "没有我带不动的小弟"
            }
            };
    res.send(info);
});
app.listen(3000);