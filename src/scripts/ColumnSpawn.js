/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 16:21
*/

import Column from "./Column";
import "./GameData"

let ranTime=2000,timer=0
let columnParent
let columnArr = []

export default class ColumnSpawn extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:columnPrefab, tips:"提示文本", type:Prefab, default:null}*/
        this.columnPrefab=null;
    }

    onAwake() {
        columnParent = this.owner.getChildByName("ColumnParent")
        Laya.stage.on("Again", this, ()=>{
            columnArr.forEach((element)=>{
                element.removeSelf()
            })
        })
    }

    onUpdate(){
        if(GameData.isGaming == false){
            timer = 0
            return
        }
        timer += Laya.timer.delta
        if(timer >= ranTime){
            timer = 0;
            ranTime = this.getRandom(4000,5000)
            this.spawn()
        }
    }

    spawn(){
        var bottomColum = Laya.Pool.getItemByCreateFun("Column", this.createFunc, this)
        columnParent.addChild(bottomColum)
        bottomColum.rotation = 0
        let bottomY = this.getRandom(300, 600)
        bottomColum.pos(920, bottomY)
        bottomColum.getComponent(Column).canAddScore = true
        columnArr.push(bottomColum)

        let cha = this.getRandom(245,348)
        let topY = bottomY - cha

        var topColumn = Laya.Pool.getItemByCreateFun("Column", this.createFunc, this)
        columnParent.addChild(topColumn)
        topColumn.rotation = 180
        topColumn.pos(1160, topY)
        topColumn.getComponent(Column).canAddScore = false
        columnArr.push(topColumn)
    }

    createFunc(){
        var temp = this.columnPrefab.create()
        return temp
    }

    getRandom(min, max){
        return min + Math.random()*(max-min)
    }
}