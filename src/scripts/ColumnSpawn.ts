import Column from "./Column";

/**
* @ data: 2023-01-13 10:58
*/
export default class ColumnSpawn extends Laya.Script {

    

    /** @prop {name: min, type: Number, tips: '最小生成时间间隔', default: 2000} */
    public min: number = 2000;
    /** @prop {name: max, type: Number, tips: '最大生成时间间隔', default: 2500} */
    public max: number = 2500;
    /** @prop {name: columnPreb, type: Prefab, tips: '柱子预制体', default: null} */
    public columnPreb: Laya.Prefab = null;
    
    private timer: number = 0;
    private spawnTime: number = 2000;
    private isGameOver = false;

    constructor() {
        super();
    }

    onAwake(): void {
        Laya.stage.on('gameover', this, this.handleGameover);
    }

    onUpdate(): void {
        if (this.isGameOver) return;

        this.timer += Laya.timer.delta;
        if (this.timer >= this.spawnTime) {
            // 重置计时器
            this.timer = 0;
            this.spawnTime = this.getRandom(this.min, this.max);

            this.spawn();
        }
    }

    private handleGameover(): void {
        this.isGameOver = true;
    }

    private getRandom(min: number, max: number): number {
        let ret: number = 0;
        if (min < max) {
            ret = Math.random() * (max - min) + min;
        } else {
            ret = Math.random() * (min - max) + max;
        }
        return ret;
    }

    // 创建预制体实例
    private spawn(): void {

        // bottom 292-612
        // const bottomColumn = this.columnPreb.create() as Laya.Sprite;
        // 使用对象池技术优化
        const bottomColumn = Laya.Pool.getItemByCreateFun('Column', this.createColumnIfNotExist, this);
        bottomColumn.getComponent(Column).canAddScore = true;
        bottomColumn.rotation = 0;
        const bcY = this.getRandom(192, 612);
        bottomColumn.pos(1920, bcY);
        this.owner.addChild(bottomColumn);

        // delta 170-490
        const delta = this.getRandom(170, 490);
        const tcY = bcY - delta;

        const topColumn = Laya.Pool.getItemByCreateFun('Column', this.createColumnIfNotExist, this);
        topColumn.rotation = 180;
        topColumn.pos(2176, tcY);
        // 防止重复计数
        topColumn.getComponent(Column).canAddScore = false;
        this.owner.addChild(topColumn);
    }

    private createColumnIfNotExist(): Laya.Sprite {
        const temp = this.columnPreb.create() as Laya.Sprite;
        temp.zOrder = -1;
        return temp;
    }

    onDestroy(): void {
        Laya.stage.off('gameover', this, this.handleGameover);
        super.destroy();
    }
}  