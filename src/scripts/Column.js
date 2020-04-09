/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 22:34
*/
export default class Column extends Laya.Script {

    constructor() {
        super();
        this.canAddScore = true
    }

    onAwake() {
    }

    onUpdate(){
        if(this.owner.x <= -300){
            this.owner.removeSelf()
            Laya.Pool.recover("Column", this.owner)
            return
        }
        if(this.canAddScore && this.owner.x <= -130){
            this.canAddScore = false
            console.log("增加分数")
            GameData.score++

            Laya.SoundManager.playSound("audio/score.mp3")
        }
    }
}