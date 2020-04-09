/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import main from "./scripts/main"
import AutoMove from "./scripts/AutoMove"
import RepeatingBg from "./scripts/RepeatingBg"
import BirdCtrl from "./scripts/BirdCtrl"
import ColumnSpawn from "./scripts/ColumnSpawn"
import UICtrl from "./scripts/UICtrl"
import FailPanel from "./scripts/FailPanel"
import Column from "./scripts/Column"

export default class GameConfig {
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
