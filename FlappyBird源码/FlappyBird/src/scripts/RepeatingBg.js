/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-12-27 06:28
*/
let width;
export default class RepeatingBg extends Laya.Script {

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