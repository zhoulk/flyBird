!function(){"use strict";let e,a=!1,t=!1;class n extends Laya.Script{constructor(){super(),this.force=null}static getGameover(){return a}onAwake(){Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown),Laya.stage.on("Again",this,this.againGame),this.owner.getComponent(Laya.RigidBody).type="static",Laya.stage.on("Start",this,function(){this.owner.getComponent(Laya.RigidBody).type="dynamic",t=!0})}againGame(){a=!1,this.owner.pos(300,402),this.owner.rotation=0,this.owner.autoAnimation="Idle",this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0}}mouseDown(){0!=t&&(a||(this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:this.force},this.owner.autoAnimation="Fly",this.owner.loop=!1,Laya.SoundManager.playSound("audio/fly.mp3",1)))}onUpdate(){0==this.owner.isPlaying&&(this.owner.autoAnimation="Idle")}onTriggerEnter(e){"TopCollider"!=e.owner.name&&(this.owner.autoAnimation="Die",a=!0,Laya.stage.event("Gameover"),Laya.SoundManager.playSound("audio/hit.mp3",1))}}class o extends Laya.Script{constructor(){super()}onAwake(){this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0},Laya.stage.on("Again",this,function(){this.owner.getComponent(Laya.RigidBody).linearVelocity={x:-3,y:0}})}onUpdate(){n.getGameover()&&(this.owner.getComponent(Laya.RigidBody).linearVelocity={x:0,y:0})}}class i extends Laya.Script{constructor(){super()}onAwake(){e=this.owner.width}onUpdate(){this.owner.x<=-e&&(this.owner.x+=2*e)}}class s extends Laya.Script{constructor(){super(),this.canAddScore=!0}onAwake(){}onUpdate(){this.owner.x<=-255&&(this.owner.removeSelf(),Laya.Pool.recover("Column",this.owner),console.log("recover")),this.canAddScore&&this.owner.x<=75&&(this.canAddScore=!1,Laya.stage.event("AddScore"),Laya.SoundManager.playSound("audio/score.mp3",1))}}let r,l=2e3,c=0,h=!0,y=[];class g extends Laya.Script{constructor(){super(),this.columnPre=null}onAwake(){r=this.owner.getChildByName("ColumnParent"),Laya.stage.on("Gameover",this,function(){h=!0}),Laya.stage.on("Again",this,function(){h=!1,y.forEach(e=>{e.removeSelf()}),y=[]}),Laya.stage.on("Start",this,function(){h=!1})}onUpdate(){h?c=0:(c+=Laya.timer.delta)>=l&&(c=0,l=this.getRandom(3e3,4500),this.spawn())}spawn(){var e=Laya.Pool.getItemByCreateFun("Column",this.creatFun,this);r.addChild(e),e.rotation=0;var a=this.getRandom(300,660);e.pos(1920,a),e.getComponent(s).canAddScore=!0,y.push(e);var t=a-this.getRandom(245,348),n=Laya.Pool.getItemByCreateFun("Column",this.creatFun,this);r.addChild(n),n.rotation=180,n.pos(2176,t),n.getComponent(s).canAddScore=!1,y.push(n)}creatFun(){return this.columnPre.create()}getRandom(e,a){var t=0;return a>e?(t=Math.random()*(a-e),t+=e):(t=Math.random()*(e-a),t+=a),t}}let d=0,L=!1;class u extends Laya.Script{constructor(){super(),this.txt_Score=null,this.gameoverPanel=null,this.rankPanel=null,this.txt_Start=null}onAwake(){this.rankPanel.visible=!1,Laya.stage.on("AddScore",this,this.addScore),Laya.stage.on("Gameover",this,this.gameover),this.gameoverPanel.visible=!1,this.init()}init(){this.gameoverPanel.getChildByName("btn_Again").on(Laya.Event.CLICK,this,this.btnAgainClick),this.gameoverPanel.getChildByName("btn_Rank").on(Laya.Event.CLICK,this,this.btnRankClick),this.txt_Rank=this.rankPanel.getChildByName("txt_Rank"),this.txt_Score.text="Score:0",this.txt_Score.visible=!1,Laya.stage.on(Laya.Event.CLICK,this,function(){L||(this.txt_Start.visible=!1,Laya.stage.event("Start"),this.txt_Score.visible=!0,L=!0)})}addScore(){d++,this.txt_Score.text="Score:"+d}gameover(){this.txt_Score.visible=!1,this.gameoverPanel.visible=!0,Laya.Tween.from(this.gameoverPanel,{alpha:0},500,Laya.Ease.linearIn)}btnAgainClick(){d=0,this.txt_Score.text="Score:0",this.txt_Score.visible=!0,this.gameoverPanel.visible=!1,Laya.stage.event("Again")}btnRankClick(){this.rankPanel.visible=!0,this.rankPanel.show(!0,!0);var e=Number(Laya.LocalStorage.getItem("One")),a=Number(Laya.LocalStorage.getItem("Two")),t=Number(Laya.LocalStorage.getItem("Three")),n=[];n.push(e,a,t,d),n=this.bubbleSort(n),console.log(n),Laya.LocalStorage.setItem("One",n[0]),Laya.LocalStorage.setItem("Two",n[1]),Laya.LocalStorage.setItem("Three",n[2]),this.txt_Rank.text="1 - "+n[0]+"\n2 - "+n[1]+"\n3 - "+n[2]}bubbleSort(e){for(var a=e.length,t=0;t<a;t++)for(var n=0;n<a-t-1;n++)if(e[n]<e[n+1]){var o=e[n+1];e[n+1]=e[n],e[n]=o}return e}}class m{static init(){let e=Laya.ClassUtils.regClass;e("scripts/AutoMove.js",o),e("scripts/RepeatingBg.js",i),e("scripts/BirdCtrl.js",n),e("scripts/ColumnSpawn.js",g),e("scripts/UICtrl.js",u),e("scripts/Column.js",s)}}m.width=1920,m.height=1080,m.scaleMode="showall",m.screenMode="horizontal",m.alignV="middle",m.alignH="center",m.startScene="Main.scene",m.sceneRoot="",m.debug=!1,m.stat=!1,m.physicsDebug=!1,m.exportSceneToJson=!0,m.init();new class{constructor(){window.Laya3D?Laya3D.init(m.width,m.height):Laya.init(m.width,m.height,Laya.WebGL),Laya.Physics&&Laya.Physics.enable(),Laya.DebugPanel&&Laya.DebugPanel.enable(),Laya.stage.scaleMode=m.scaleMode,Laya.stage.screenMode=m.screenMode,Laya.stage.alignV=m.alignV,Laya.stage.alignH=m.alignH,Laya.URL.exportSceneToJson=m.exportSceneToJson,(m.debug||"true"==Laya.Utils.getQueryString("debug"))&&Laya.enableDebugPanel(),m.physicsDebug&&Laya.PhysicsDebugDraw&&Laya.PhysicsDebugDraw.enable(),m.stat&&Laya.Stat.show(),Laya.alertGlobalError=!0,Laya.ResourceVersion.enable("version.json",Laya.Handler.create(this,this.onVersionLoaded),Laya.ResourceVersion.FILENAME_VERSION)}onVersionLoaded(){Laya.AtlasInfoManager.enable("fileconfig.json",Laya.Handler.create(this,this.onConfigLoaded))}onConfigLoaded(){m.startScene&&Laya.Scene.open(m.startScene)}}}();