/**
*
* @ author:Zhoulk
* @ email:849693228@qq.com
* @ data: 2020-04-02 23:11
*/
export default class main extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx=null;
    }

    onAwake() {
        console.log("hello")

        if(Laya.Browser.onMiniGame){
            console.log("get Device ")
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log('adapterState changed, now is', res)
            })
            //监听发现设备
            var self = this
            wx.onBluetoothDeviceFound(function (devices) {
              console.log('发现设备:', devices.devices)
              self.scanDevices(devices.devices)
            })
        
            wx.openBluetoothAdapter({
              success(res) {
                console.log(res)
        
                wx.startBluetoothDevicesDiscovery({
                  //services: ['FEE7'],
                  success(res) {
                    console.log(res)
                  },
                  fail: function (res) {
                    console.log("fail" + JSON.stringify(res))
                  },
                })
              }
            })
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
                })
                console.log('已找到指定设备:', devices[i].deviceId);

                var deviceId = devices[i].deviceId
                this.connectDevice(deviceId)
            }
        }
    }

    connectDevice(deviceId){
        var self = this
            wx.createBLEConnection({
                deviceId: deviceId,//搜索设备获得的蓝牙设备 id
                success: function (res) {
                    console.log('连接蓝牙:', res.errMsg);

                    self.searchServices(deviceId)
                },
                fail: function (res) {
                    app.showToast('连接超时,请重试或更换车辆', 'none');
                    wx.closeBluetoothAdapter();
                }
            })
    }

    searchServices(deviceId){
        var self = this
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

                self.searchCharaters(deviceId, service_id)
            },
            fail(res) {
                console.log(res);
            }
            })
    }

    searchCharaters(deviceId, service_id){
                    //获取特征值
                          wx.getBLEDeviceCharacteristics({
                            deviceId: deviceId,//搜索设备获得的蓝牙设备 id
                            serviceId: service_id,//服务ID
                            success: function (res) {
                              console.log('device特征值:', res.characteristics)
        
                              var characters = res.characteristics
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
                                      console.log('开启notify', res.errMsg)
                                      //监听低功耗蓝牙设备的特征值变化
                                      wx.onBLECharacteristicValueChange(function (res) {
                                        console.log('特征值变化', res.value);

                                        Laya.stage.event("Di")

                                      })
                                      //写入数据
                                      for (let i = 0; i < characters.length; i++) {
                                        let charc = characters[i];
                                        if (charc.properties.write) {
                                          //that.setData({ write_id: charc.uuid });
                                          console.log('写write_id:', charc.uuid);
        
                                          var str = "a50006020900585f";
                                          var buffer = new ArrayBuffer(str.length);
                                          let dataView = new DataView(buffer)
                                          let ind = 0;
                                          for (var j = 0, len = str.length; j < len; j += 2) {
                                            let code = parseInt(str.substr(j, 2), 16)
                                            dataView.setUint8(ind, code)
                                            ind++
                                          }
                                          //写入数据
                                          wx.writeBLECharacteristicValue({
                                            deviceId: deviceId,//设备deviceId
                                            serviceId: service_id,//设备service_id
                                            characteristicId: charc.uuid,//设备write特征值
                                            value: buffer,//写入数据
                                            success: function (res) {
                                              console.log('发送数据:', res.errMsg)
                                            }
                                          });
                                        }
                                      }
                                    }
                                  })
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
        )
        return hexArr.join('');
      }
}