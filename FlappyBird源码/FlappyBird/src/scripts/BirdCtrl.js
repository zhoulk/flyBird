/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 07:44
*/
let isGameover=false;
let isStart=false;
export default class BirdCtrl extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:force, tips:"提示文本", type:Number, default:null}*/
        this.force=null;
    }
    static getGameover(){
        return  isGameover;
    }
    onAwake() {
        //侦听鼠标按下
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.on("Again",this,this.againGame);

        this.owner.getComponent(Laya.RigidBody).type="static";
        
        Laya.stage.on("Start",this,function(){
            this.owner.getComponent(Laya.RigidBody).type="dynamic";
            isStart=true;
        })
    }
    //当再一次游戏按钮点击之后，这边会收到事件的派发
    againGame(){
        isGameover=false;
        this.owner.pos(300,402);
        this.owner.rotation=0;
        this.owner.autoAnimation="Idle";
        this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0}
    }
    mouseDown(){
        if(isStart==false)return;
        if(isGameover)return;
        //施加一个向上的力
        this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:this.force}
        this.owner.autoAnimation="Fly";
        this.owner.loop=false;
        Laya.SoundManager.playSound("audio/fly.mp3",1);
    }
    onUpdate(){
        //切换成Idle动画
        if(this.owner.isPlaying==false){
            this.owner.autoAnimation="Idle";
        }
    }
    //碰撞检测，游戏结束的判断
    onTriggerEnter(other){
        //判断是否是顶层阻挡，忽略掉
        if(other.owner.name=="TopCollider")
        return;

        this.owner.autoAnimation="Die";
        isGameover=true;
        Laya.stage.event("Gameover");
        Laya.SoundManager.playSound("audio/hit.mp3",1);
    }
}