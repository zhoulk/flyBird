import Column from "./Column";

/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 09:18
*/
let ranTime=2000,timer=0;
let columnParent;
let isGameover=true;
let columnArr=[];

export default class ColumnSpawn extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:columnPre, tips:"提示文本", type:Prefab, default:null}*/
        this.columnPre=null;
    }
    onAwake(){
        columnParent=this.owner.getChildByName("ColumnParent")
        Laya.stage.on("Gameover",this,function(){isGameover=true})
        Laya.stage.on("Again",this,function(){
            isGameover=false
            columnArr.forEach(element => {
                element.removeSelf();
            });
            columnArr=[]
        })
        Laya.stage.on("Start",this,function(){
            isGameover=false;
        })
    }
    onUpdate(){
        if(isGameover){
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
        columnParent.addChild(topColumn)
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
            ranValue=Math.random()*(max-min)
            ranValue+=min;
        }else{
            ranValue=Math.random()*(min-max)
            ranValue+=max;
        }
        return ranValue;
    }
}