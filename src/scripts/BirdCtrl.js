/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 14:43
*/
export default class BirdCtrl extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:force, tips:"提示文本", type:Number, default:null}*/
        this.force=null;
    }

    onAwake() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
        Laya.stage.on("Again", this, this.againGame)
        this.owner.getComponent(Laya.RigidBody).type = "static"

        Laya.stage.on("Di", this, this.onMouseDown)
    }

    onMouseDown(){
        if(GameData.isGaming == false){
            return
        }

        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:this.force}
        this.owner.autoAnimation = "Fly"
        this.owner.loop = false

        Laya.SoundManager.playSound("audio/fly.mp3")
    }

    againGame(){
        this.owner.autoAnimation = "Idle"
        this.owner.rotation = 0
        this.owner.pos(122,132)
        GameData.isGameOver = false
        GameData.isGaming = true
    }

    onUpdate(){
        //console.log(GameData.isGaming)
        if(GameData.isGaming){
            this.owner.getComponent(Laya.RigidBody).type = "dynamic"
        }

        if(this.owner.isPlaying == false){
            this.owner.autoAnimation = "Idle"
        }
    }

    onTriggerEnter(other){
        if(other.owner.name == "top"){
            return
        }
        this.owner.autoAnimation = "Die"

        //Laya.stage.event("GameOver")
        GameData.isGameOver = true
        GameData.isGaming = false
        let lastScore = Number(Laya.LocalStorage.getItem("Score"))
        if(GameData.score > lastScore){
            Laya.LocalStorage.setItem("Score", GameData.score)
        }

        Laya.SoundManager.playSound("audio/hit.mp3")
    }
}