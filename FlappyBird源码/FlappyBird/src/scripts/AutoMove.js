import BirdCtrl from "./BirdCtrl";

/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 06:15
*/
export default class AutoMove extends Laya.Script {

    constructor() {
        super();
    }

    onAwake() {
        this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0}
        Laya.stage.on("Again",this,function(){
            this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0}
        })
    }
    onUpdate(){
        if(BirdCtrl.getGameover()){
            this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0}
        }
    }
}