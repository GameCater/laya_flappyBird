/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import AutoMove from "./scripts/AutoMove"
import RepeatingBg from "./scripts/RepeatingBg"
import BirdFly from "./scripts/BirdFly"
import ColumnSpawn from "./scripts/ColumnSpawn"
import UIManager from "./scripts/UIManager"
import Column from "./scripts/Column"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1920;
    static height:number=1080;
    static scaleMode:string="noscale";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="center";
    static startScene:any="UI.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=true;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("scripts/AutoMove.ts",AutoMove);
        reg("scripts/RepeatingBg.ts",RepeatingBg);
        reg("scripts/BirdFly.ts",BirdFly);
        reg("scripts/ColumnSpawn.ts",ColumnSpawn);
        reg("scripts/UIManager.ts",UIManager);
        reg("scripts/Column.ts",Column);
    }
}
GameConfig.init();