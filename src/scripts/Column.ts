/**
* @ data: 2023-01-13 13:45
*/
export default class Column extends Laya.Script {

    private canAddScore = true;
    private scorePoint: number = 15;
    private parent: Laya.Sprite;

    constructor() {
        super();
    }

    onAwake(): void {
        this.parent = this.owner as Laya.Sprite;
    }

    onUpdate(): void {

        // 超出地图回收
        if (this.parent.x <= -210) {
            
            // 先从舞台上移除
            this.parent.removeSelf();
            // 回收Column
            Laya.Pool.recover('Column', this.parent);
        }

        if (this.canAddScore && this.parent.x <= this.scorePoint) {
            this.canAddScore = false;
            // 增加得分
            Laya.stage.event('addScore');
        }
    }
}