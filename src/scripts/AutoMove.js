/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 00:09
*/
export default class AutoMove extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx=null;
    }

    onAwake() {
        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0}
        Laya.stage.on("Again", this, ()=>{
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0}
        })
    }

    onUpdate(){
        if(GameData.isGameOver){
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:0}
        }
    }
}