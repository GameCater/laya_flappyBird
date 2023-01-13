/**
* @ data: 2023-01-12 12:57
*/
export default class RepeatingBg extends Laya.Script {

    /** @prop {name: BG_WIDTH, tips: '背景宽度', type: Number, default: 2048} */
    public BG_WIDTH: number = 2048;

    private sp: Laya.Sprite;
    constructor() {
        super();
    }

    onAwake(): void {
        this.sp = this.owner as Laya.Sprite;
    }

    onUpdate(): void {
        if (this.sp.x <= -this.BG_WIDTH) {
            this.sp.x += this.BG_WIDTH * 2;
        }

    }
}