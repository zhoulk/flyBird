(function () {
    'use strict';

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 07:44
    */
    let isGameover=false;
    let isStart=false;
    class BirdCtrl extends Laya.Script {

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
            });
        }
        //当再一次游戏按钮点击之后，这边会收到事件的派发
        againGame(){
            isGameover=false;
            this.owner.pos(300,402);
            this.owner.rotation=0;
            this.owner.autoAnimation="Idle";
            this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0};
        }
        mouseDown(){
            if(isStart==false)return;
            if(isGameover)return;
            //施加一个向上的力
            this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:this.force};
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

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 06:15
    */
    class AutoMove extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0};
            Laya.stage.on("Again",this,function(){
                this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0};
            });
        }
        onUpdate(){
            if(BirdCtrl.getGameover()){
                this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0};
            }
        }
    }

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 06:28
    */
    let width;
    class RepeatingBg extends Laya.Script {

        constructor() {
            super();
        }

        onAwake(){
            width=this.owner.width;
        }
        onUpdate(){
            if(this.owner.x<=-width){
                this.owner.x+=width*2;
            }
        }
    }

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 10:11
    */
    class Column extends Laya.Script {

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
                console.log("recover");
            }
            if(this.canAddScore&&this.owner.x<=75){
                this.canAddScore=false;
                //计分
                Laya.stage.event("AddScore");
                Laya.SoundManager.playSound("audio/score.mp3",1);
            }
        }
    }

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 09:18
    */
    let ranTime=2000,timer=0;
    let columnParent;
    let isGameover$1=true;
    let columnArr=[];

    class ColumnSpawn extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:columnPre, tips:"提示文本", type:Prefab, default:null}*/
            this.columnPre=null;
        }
        onAwake(){
            columnParent=this.owner.getChildByName("ColumnParent");
            Laya.stage.on("Gameover",this,function(){isGameover$1=true;});
            Laya.stage.on("Again",this,function(){
                isGameover$1=false;
                columnArr.forEach(element => {
                    element.removeSelf();
                });
                columnArr=[];
            });
            Laya.stage.on("Start",this,function(){
                isGameover$1=false;
            });
        }
        onUpdate(){
            if(isGameover$1){
                timer=0;
                return
            }

            timer+=Laya.timer.delta;
            if(timer>=ranTime){
                timer=0;
                ranTime=this.getRandom(3000,4500);
                this.spawn();
            }
        }
        //生成柱子的方法
        spawn(){
            //bottom
            //300-660
            var bottomColumn=Laya.Pool.getItemByCreateFun("Column",this.creatFun,this);
            columnParent.addChild(bottomColumn);
            bottomColumn.rotation=0;
            var bottomY=this.getRandom(300,660);
            bottomColumn.pos(1920,bottomY);
            bottomColumn.getComponent(Column).canAddScore=true;
            columnArr.push(bottomColumn);

            //chazhi
            //245-348
            var cha=this.getRandom(245,348);
            var topY=bottomY-cha;

            //top
            var topColumn=Laya.Pool.getItemByCreateFun("Column",this.creatFun,this);
            columnParent.addChild(topColumn);
            topColumn.rotation=180;
            topColumn.pos(2176,topY);
            //topColumn.getComponent(Column).destroy();
            topColumn.getComponent(Column).canAddScore=false;
            columnArr.push(topColumn);
        }
        creatFun(){
            var temp=this.columnPre.create();
            return temp;
        }
        //获取min - max之间的随机值
        getRandom(min,max){
            var ranValue=0;
            if(max>min){
                ranValue=Math.random()*(max-min);
                ranValue+=min;
            }else{
                ranValue=Math.random()*(min-max);
                ranValue+=max;
            }
            return ranValue;
        }
    }

    /**
    *
    * @ author:Carson
    * @ email:976627526@qq.com
    * @ data: 2019-12-27 14:11
    */
    let score=0;
    let isStart$1=false;

    class UICtrl extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:txt_Score, tips:"提示文本", type:Node, default:null}*/
            this.txt_Score=null;
            /** @prop {name:gameoverPanel, tips:"提示文本", type:Node, default:null}*/
            this.gameoverPanel=null;
            /** @prop {name:rankPanel, tips:"提示文本", type:Node, default:null}*/
            this.rankPanel=null;
            /** @prop {name:txt_Start, tips:"提示文本", type:Node, default:null}*/
            this.txt_Start=null;
        }

        onAwake() {
            this.rankPanel.visible=false;
            Laya.stage.on("AddScore",this,this.addScore);
            Laya.stage.on("Gameover",this,this.gameover);
            this.gameoverPanel.visible=false;

            this.init();
        }
        init(){
            this.gameoverPanel.getChildByName("btn_Again").on(Laya.Event.CLICK,this,this.btnAgainClick);
            this.gameoverPanel.getChildByName("btn_Rank").on(Laya.Event.CLICK,this,this.btnRankClick);
            this.txt_Rank=this.rankPanel.getChildByName("txt_Rank");
            this.txt_Score.text="Score:0";
            this.txt_Score.visible=false;
            Laya.stage.on(Laya.Event.CLICK,this,function(){
                if(isStart$1)return;
                this.txt_Start.visible=false;
                Laya.stage.event("Start");
                this.txt_Score.visible=true;
                isStart$1=true;
            });
        }
        //成绩增加
        addScore(){
            score++;
            this.txt_Score.text="Score:"+score;
        }
        //游戏结束
        gameover(){
            this.txt_Score.visible=false;
            this.gameoverPanel.visible=true;
            Laya.Tween.from(this.gameoverPanel,{alpha:0},500,Laya.Ease.linearIn);
        }
        //再来一局按钮点击
        btnAgainClick(){
            score=0;
            this.txt_Score.text="Score:0";
            this.txt_Score.visible=true;
            this.gameoverPanel.visible=false;
            Laya.stage.event("Again");
        }
        //排行榜按钮点击
        btnRankClick(){
            this.rankPanel.visible=true;
            this.rankPanel.show(true,true);
            //排名
            //从本地获取前三名成绩
            var one= Number(Laya.LocalStorage.getItem("One"));
            var two= Number(Laya.LocalStorage.getItem("Two"));
            var three= Number(Laya.LocalStorage.getItem("Three"));

            var scoreArr=[];
            scoreArr.push(one,two,three,score);
            scoreArr=this.bubbleSort(scoreArr);

            console.log(scoreArr);
            Laya.LocalStorage.setItem("One",scoreArr[0]);
            Laya.LocalStorage.setItem("Two",scoreArr[1]);
            Laya.LocalStorage.setItem("Three",scoreArr[2]);

            this.txt_Rank.text="1 - "+scoreArr[0]+"\n2 - "+scoreArr[1]+"\n3 - "+scoreArr[2];
        }
        //冒泡排序
        bubbleSort(arr){
            var len=arr.length;
            for(var i=0;i<len;i++){
                for(var j=0;j<len-i-1;j++){
                    if(arr[j]<arr[j+1]){
                        var temp=arr[j+1];
                        arr[j+1]=arr[j];
                        arr[j]=temp;
                    }
                }
            }
            return arr;
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/RepeatingBg.js",RepeatingBg);
    		reg("scripts/BirdCtrl.js",BirdCtrl);
    		reg("scripts/ColumnSpawn.js",ColumnSpawn);
    		reg("scripts/UICtrl.js",UICtrl);
    		reg("scripts/Column.js",Column);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
