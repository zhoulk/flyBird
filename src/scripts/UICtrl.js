/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 23:42
*/

let _UICtrl
export default class UICtrl extends Laya.Script {
    static Instance(){
        return _UICtrl
    }

    constructor() {
        super();
        /** @prop {name:scoreTxt, tips:"提示文本", type:Node, default:null}*/
        this.scoreTxt=null;
        /** @prop {name:startTxt, tips:"提示文本", type:Node, default:null}*/
        this.startTxt=null;
        /** @prop {name:failPanel, tips:"提示文本", type:Node, default:null}*/
        this.failPanel=null;
        /** @prop {name:rankPanel, tips:"提示文本", type:Node, default:null}*/
        this.rankPanel=null;
        /** @prop {name:rankScore, tips:"提示文本", type:Node, default:null}*/
        this.rankScore=null;

        _UICtrl = this
    }

    onAwake() {
        this.failPanel.visible = false
        this.rankPanel.visible = false
        this.scoreTxt.visible = false

        Laya.stage.on(Laya.Event.CLICK, this, this.OnStartClick)

        if(Laya.Browser.onMiniGame){
            var self = this
            wx.getSystemInfo({
                success: function(res) {
               //model中包含着设备信息
                 console.log(res.model)
                    var model = res.model
                    if (model.search('iPhone X') != -1){
                        //app.globalData.isIpx = true;
                        self.scoreTxt.pos(0,75)
                    }
               }
            })
        }
    }

    onUpdate(){
        this.scoreTxt.text = "Score:" + GameData.score

        if(GameData.isGameOver){
            this.scoreTxt.visible = false
            if(this.failPanel.visible == false){
                this.failPanel.visible = true
                Laya.Tween.from(this.failPanel, {alpha:0}, 500, Laya.Ease.linearIn)
            }
        }
    }

    OnStartClick(){
        if(GameData.isIdle){
            this.scoreTxt.visible = true
            this.startTxt.visible = false
            GameData.isIdle = false
            GameData.isGaming = true
        }
    }

    againGame(){
        GameData.score = 0
        GameData.isGameOver = false
        this.scoreTxt.visible = true
        this.failPanel.visible = false
    }

    showRank(){
        let score = Laya.LocalStorage.getItem("Score")
        if(score == null){
            score = "0"
        }
        this.rankScore.text = "最高分:" + score
        this.rankPanel.visible = true
        this.rankPanel.show()
    }
}