/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 14:11
*/
let score=0;
let isStart=false;

export default class UICtrl extends Laya.Script {

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
        Laya.stage.on("Gameover",this,this.gameover)
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
            if(isStart)return;
            this.txt_Start.visible=false;
            Laya.stage.event("Start");
            this.txt_Score.visible=true;
            isStart=true;
        })
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
        this.rankPanel.show(true,true)
        //排名
        //从本地获取前三名成绩
        var one= Number(Laya.LocalStorage.getItem("One"));
        var two= Number(Laya.LocalStorage.getItem("Two"));
        var three= Number(Laya.LocalStorage.getItem("Three"));

        var scoreArr=[];
        scoreArr.push(one,two,three,score);
        scoreArr=this.bubbleSort(scoreArr);

        console.log(scoreArr)
        Laya.LocalStorage.setItem("One",scoreArr[0])
        Laya.LocalStorage.setItem("Two",scoreArr[1])
        Laya.LocalStorage.setItem("Three",scoreArr[2])

        this.txt_Rank.text="1 - "+scoreArr[0]+"\n2 - "+scoreArr[1]+"\n3 - "+scoreArr[2]
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