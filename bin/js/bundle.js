(function () {
    'use strict';

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-02 23:11
    */
    class main extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
        }

        onAwake() {
            console.log("hello");

            if(Laya.Browser.onMiniGame){
                console.log("get Device ");
                wx.onBluetoothAdapterStateChange(function (res) {
                  console.log('adapterState changed, now is', res);
                });
                //监听发现设备
                var self = this;
                wx.onBluetoothDeviceFound(function (devices) {
                  console.log('发现设备:', devices.devices);
                  self.scanDevices(devices.devices);
                });
            
                wx.openBluetoothAdapter({
                  success(res) {
                    console.log(res);
            
                    wx.startBluetoothDevicesDiscovery({
                      //services: ['FEE7'],
                      success(res) {
                        console.log(res);
                      },
                      fail: function (res) {
                        console.log("fail" + JSON.stringify(res));
                      },
                    });
                  }
                });
            }
        }

        scanDevices(devices){
            for (let i = 0; i < devices.length; i++) {
                //检索指定设备
                if (devices[i].name == 'Odun_Pen') {
                    //关闭搜索
                    //that.stopBluetoothDevicesDiscovery();
                    wx.stopBluetoothDevicesDiscovery({
                    success: function(res) {},
                    });
                    console.log('已找到指定设备:', devices[i].deviceId);

                    var deviceId = devices[i].deviceId;
                    this.connectDevice(deviceId);
                }
            }
        }

        connectDevice(deviceId){
            var self = this;
                wx.createBLEConnection({
                    deviceId: deviceId,//搜索设备获得的蓝牙设备 id
                    success: function (res) {
                        console.log('连接蓝牙:', res.errMsg);

                        self.searchServices(deviceId);
                    },
                    fail: function (res) {
                        app.showToast('连接超时,请重试或更换车辆', 'none');
                        wx.closeBluetoothAdapter();
                    }
                });
        }

        searchServices(deviceId){
            var self = this;
            wx.getBLEDeviceServices({
                deviceId: deviceId,//搜索设备获得的蓝牙设备 id
                success: function (res) {
                    let service_id = "";
                    for (let i = 0; i < res.services.length; i++) {
                    if (res.services[i].uuid.toUpperCase().indexOf("AA00") != -1) {
                        service_id = res.services[i].uuid;
                        break;
                    }
                    }
                    console.log('fee7-service_id:', service_id);

                    self.searchCharaters(deviceId, service_id);
                },
                fail(res) {
                    console.log(res);
                }
                });
        }

        searchCharaters(deviceId, service_id){
                        //获取特征值
                              wx.getBLEDeviceCharacteristics({
                                deviceId: deviceId,//搜索设备获得的蓝牙设备 id
                                serviceId: service_id,//服务ID
                                success: function (res) {
                                  console.log('device特征值:', res.characteristics);
            
                                  var characters = res.characteristics;
                                  for (let i = 0; i < res.characteristics.length; i++) {
                                    let charc = res.characteristics[i];
                                    if (charc.properties.notify) {
                                      //that.setData({ indicate_id: charc.uuid });
                                      console.log('indicate_id:', charc.uuid);
            
                                      //开启notify
                                      wx.notifyBLECharacteristicValueChange({
                                        state: true, // 启用 notify 功能
                                        deviceId: deviceId,//蓝牙设备id
                                        serviceId: service_id,//服务id
                                        characteristicId: charc.uuid,//服务特征值indicate
                                        success: function (res) {
                                          console.log('开启notify', res.errMsg);
                                          //监听低功耗蓝牙设备的特征值变化
                                          wx.onBLECharacteristicValueChange(function (res) {
                                            console.log('特征值变化', res.value);

                                            Laya.stage.event("Di");

                                          });
                                          //写入数据
                                          for (let i = 0; i < characters.length; i++) {
                                            let charc = characters[i];
                                            if (charc.properties.write) {
                                              //that.setData({ write_id: charc.uuid });
                                              console.log('写write_id:', charc.uuid);
            
                                              var str = "a50006020900585f";
                                              var buffer = new ArrayBuffer(str.length);
                                              let dataView = new DataView(buffer);
                                              let ind = 0;
                                              for (var j = 0, len = str.length; j < len; j += 2) {
                                                let code = parseInt(str.substr(j, 2), 16);
                                                dataView.setUint8(ind, code);
                                                ind++;
                                              }
                                              //写入数据
                                              wx.writeBLECharacteristicValue({
                                                deviceId: deviceId,//设备deviceId
                                                serviceId: service_id,//设备service_id
                                                characteristicId: charc.uuid,//设备write特征值
                                                value: buffer,//写入数据
                                                success: function (res) {
                                                  console.log('发送数据:', res.errMsg);
                                                }
                                              });
                                            }
                                          }
                                        }
                                      });
                                    }
                                  }
                                }
                              });
        }

        ab2hex(buffer) {
            var hexArr = Array.prototype.map.call(
              new Uint8Array(buffer),
              function(bit) {
                return ('00' + bit.toString(16)).slice(-2)
              }
            );
            return hexArr.join('');
          }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 00:09
    */
    class AutoMove extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
        }

        onAwake() {
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0};
            Laya.stage.on("Again", this, ()=>{
                this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0};
            });
        }

        onUpdate(){
            if(GameData.isGameOver){
                this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:0};
            }
        }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 00:17
    */

    let width;
    class RepeatingBg extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
        }

        onAwake(){
            width = this.owner.width;
        }

        onUpdate(){
            //console.log(this.owner.name + "  " +this.owner.x + "  " + width)
            if(this.owner.x <= -width){
                console.log(this.owner.name + "  " +this.owner.x + "  " + width);
                this.owner.x += width*2;
            }
        }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 14:43
    */
    class BirdCtrl extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:force, tips:"提示文本", type:Number, default:null}*/
            this.force=null;
        }

        onAwake() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on("Again", this, this.againGame);
            this.owner.getComponent(Laya.RigidBody).type = "static";

            Laya.stage.on("Di", this, this.onMouseDown);
        }

        onMouseDown(){
            if(GameData.isGaming == false){
                return
            }

            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:this.force};
            this.owner.autoAnimation = "Fly";
            this.owner.loop = false;

            Laya.SoundManager.playSound("audio/fly.mp3");
        }

        againGame(){
            this.owner.autoAnimation = "Idle";
            this.owner.rotation = 0;
            this.owner.pos(122,132);
            GameData.isGameOver = false;
            GameData.isGaming = true;
        }

        onUpdate(){
            //console.log(GameData.isGaming)
            if(GameData.isGaming){
                this.owner.getComponent(Laya.RigidBody).type = "dynamic";
            }

            if(this.owner.isPlaying == false){
                this.owner.autoAnimation = "Idle";
            }
        }

        onTriggerEnter(other){
            if(other.owner.name == "top"){
                return
            }
            this.owner.autoAnimation = "Die";

            //Laya.stage.event("GameOver")
            GameData.isGameOver = true;
            GameData.isGaming = false;
            let lastScore = Number(Laya.LocalStorage.getItem("Score"));
            if(GameData.score > lastScore){
                Laya.LocalStorage.setItem("Score", GameData.score);
            }

            Laya.SoundManager.playSound("audio/hit.mp3");
        }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 22:34
    */
    class Column extends Laya.Script {

        constructor() {
            super();
            this.canAddScore = true;
        }

        onAwake() {
        }

        onUpdate(){
            if(this.owner.x <= -300){
                this.owner.removeSelf();
                Laya.Pool.recover("Column", this.owner);
                return
            }
            if(this.canAddScore && this.owner.x <= -130){
                this.canAddScore = false;
                console.log("增加分数");
                GameData.score++;

                Laya.SoundManager.playSound("audio/score.mp3");
            }
        }
    }

    window.GameData || (window.GameData = {
        isIdle: true,
        isGaming: false,
        isGameOver: false,
        score: 0,
    });

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 16:21
    */

    let ranTime=2000,timer=0;
    let columnParent;
    let columnArr = [];

    class ColumnSpawn extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:columnPrefab, tips:"提示文本", type:Prefab, default:null}*/
            this.columnPrefab=null;
        }

        onAwake() {
            columnParent = this.owner.getChildByName("ColumnParent");
            Laya.stage.on("Again", this, ()=>{
                columnArr.forEach((element)=>{
                    element.removeSelf();
                });
            });
        }

        onUpdate(){
            if(GameData.isGaming == false){
                timer = 0;
                return
            }
            timer += Laya.timer.delta;
            if(timer >= ranTime){
                timer = 0;
                ranTime = this.getRandom(4000,5000);
                this.spawn();
            }
        }

        spawn(){
            var bottomColum = Laya.Pool.getItemByCreateFun("Column", this.createFunc, this);
            columnParent.addChild(bottomColum);
            bottomColum.rotation = 0;
            let bottomY = this.getRandom(300, 600);
            bottomColum.pos(920, bottomY);
            bottomColum.getComponent(Column).canAddScore = true;
            columnArr.push(bottomColum);

            let cha = this.getRandom(245,348);
            let topY = bottomY - cha;

            var topColumn = Laya.Pool.getItemByCreateFun("Column", this.createFunc, this);
            columnParent.addChild(topColumn);
            topColumn.rotation = 180;
            topColumn.pos(1160, topY);
            topColumn.getComponent(Column).canAddScore = false;
            columnArr.push(topColumn);
        }

        createFunc(){
            var temp = this.columnPrefab.create();
            return temp
        }

        getRandom(min, max){
            return min + Math.random()*(max-min)
        }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-05 23:42
    */

    let _UICtrl;
    class UICtrl extends Laya.Script {
        static Instance(){
            return _UICtrl
        }

        constructor() {
            super();
            /** @prop {name:scoreTxt, tips:"提示文本", type:Node, default:null}*/
            this.scoreTxt=null;
            /** @prop {name:startTxt, tips:"提示文本", type:Node, default:null}*/
            this.startTxt=null;
            /** @prop {name:failPanel, tips:"提示文本", type:Node, default:null}*/
            this.failPanel=null;
            /** @prop {name:rankPanel, tips:"提示文本", type:Node, default:null}*/
            this.rankPanel=null;
            /** @prop {name:rankScore, tips:"提示文本", type:Node, default:null}*/
            this.rankScore=null;

            _UICtrl = this;
        }

        onAwake() {
            this.failPanel.visible = false;
            this.rankPanel.visible = false;
            this.scoreTxt.visible = false;

            Laya.stage.on(Laya.Event.CLICK, this, this.OnStartClick);

            if(Laya.Browser.onMiniGame){
                var self = this;
                wx.getSystemInfo({
                    success: function(res) {
                   //model中包含着设备信息
                     console.log(res.model);
                        var model = res.model;
                        if (model.search('iPhone X') != -1){
                            //app.globalData.isIpx = true;
                            self.scoreTxt.pos(0,75);
                        }
                   }
                });
            }
        }

        onUpdate(){
            this.scoreTxt.text = "Score:" + GameData.score;

            if(GameData.isGameOver){
                this.scoreTxt.visible = false;
                if(this.failPanel.visible == false){
                    this.failPanel.visible = true;
                    Laya.Tween.from(this.failPanel, {alpha:0}, 500, Laya.Ease.linearIn);
                }
            }
        }

        OnStartClick(){
            if(GameData.isIdle){
                this.scoreTxt.visible = true;
                this.startTxt.visible = false;
                GameData.isIdle = false;
                GameData.isGaming = true;
            }
        }

        againGame(){
            GameData.score = 0;
            GameData.isGameOver = false;
            this.scoreTxt.visible = true;
            this.failPanel.visible = false;
        }

        showRank(){
            let score = Laya.LocalStorage.getItem("Score");
            if(score == null){
                score = "0";
            }
            this.rankScore.text = "最高分:" + score;
            this.rankPanel.visible = true;
            this.rankPanel.show();
        }
    }

    /**
    *
    * @ author:Zhoulk
    * @ email:849693228@qq.com
    * @ data: 2020-04-06 09:04
    */
    class FailPanel extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:rankBtn, tips:"提示文本", type:Node, default:null}*/
            this.rankBtn=null;
            /** @prop {name:againBtn, tips:"提示文本", type:Node, default:null}*/
            this.againBtn=null;
        }

        onAwake() {
            this.rankBtn.on(Laya.Event.CLICK, this, this.OnRankClick);
            this.againBtn.on(Laya.Event.CLICK, this, this.OnAgainClick);
        }

        OnRankClick(){
            UICtrl.Instance().showRank();
        }

        OnAgainClick(){
            UICtrl.Instance().againGame();
            Laya.stage.event("Again");
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/main.js",main);
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/RepeatingBg.js",RepeatingBg);
    		reg("scripts/BirdCtrl.js",BirdCtrl);
    		reg("scripts/ColumnSpawn.js",ColumnSpawn);
    		reg("scripts/UICtrl.js",UICtrl);
    		reg("scripts/FailPanel.js",FailPanel);
    		reg("scripts/Column.js",Column);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "main.scene";
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
    		Laya.alertGlobalError(true);

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
