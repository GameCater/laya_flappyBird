/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class MainUI extends Scene {
		public sp_bg1:Laya.Sprite;
		public sp_bg2:Laya.Sprite;
		public sp_ground1:Laya.Sprite;
		public sp_ground2:Laya.Sprite;
		public sp_bird:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Main");
        }
    }
    REG("ui.MainUI",MainUI);
    export class UIUI extends View {
		public box_finish:Laya.Box;
		public sp_bg:Laya.Sprite;
		public btn_restart:Laya.Button;
		public btn_rank:Laya.Button;
		public rank_panel:Dialog;
		public txt_info:Laya.Text;
		public btn_start:Laya.Text;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("UI");
        }
    }
    REG("ui.UIUI",UIUI);
}