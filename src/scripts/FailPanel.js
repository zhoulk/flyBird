import UICtrl from "./UICtrl";

/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-06 09:04
*/
export default class FailPanel extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:rankBtn, tips:"提示文本", type:Node, default:null}*/
        this.rankBtn=null;
        /** @prop {name:againBtn, tips:"提示文本", type:Node, default:null}*/
        this.againBtn=null;
    }

    onAwake() {
        this.rankBtn.on(Laya.Event.CLICK, this, this.OnRankClick)
        this.againBtn.on(Laya.Event.CLICK, this, this.OnAgainClick)
    }

    OnRankClick(){
        UICtrl.Instance().showRank()
    }

    OnAgainClick(){
        UICtrl.Instance().againGame()
        Laya.stage.event("Again")
    }
}