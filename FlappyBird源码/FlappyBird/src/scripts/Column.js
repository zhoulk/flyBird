/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 10:11
*/
export default class Column extends Laya.Script {

    constructor() {
        super();
        this.canAddScore=true;
    }

    onAwake() {
    }
    onUpdate(){
        if(this.owner.x<=-255){
            this.owner.removeSelf();
            Laya.Pool.recover("Column",this.owner);
            console.log("recover")
        }
        if(this.canAddScore&&this.owner.x<=75){
            this.canAddScore=false;
            //计分
            Laya.stage.event("AddScore");
            Laya.SoundManager.playSound("audio/score.mp3",1);
        }
    }
}