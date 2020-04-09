/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-05 00:17
*/

let width
export default class RepeatingBg extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx=null;
    }

    onAwake(){
        width = this.owner.width
    }

    onUpdate(){
        //console.log(this.owner.name + "  " +this.owner.x + "  " + width)
        if(this.owner.x <= -width){
            console.log(this.owner.name + "  " +this.owner.x + "  " + width)
            this.owner.x += width*2
        }
    }
}