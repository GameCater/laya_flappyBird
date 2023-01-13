/**
* @ data: 2023-01-12 15:46
*/
export default class BirdFly extends Laya.Script {

    /** @prop {name: flySpeed, type: Number, tips: '小鸟向上飞行的速度', default: 10} */
    public flySpeed = 10;
    private self: Laya.Animation;
    private isGameover = false;

    constructor() {
        super();
    }

    onAwake() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.self = this.owner as Laya.Animation;
    }

    onMouseDown(): void {
        if (this.isGameover) return;
        // 施加一个向上的力
        (this.owner.getComponent(Laya.RigidBody) as Laya.RigidBody).linearVelocity = new Laya.Vector2(0, -this.flySpeed);
        this.self.autoAnimation = 'Fly';
        this.self.loop = false;
    }

    onUpdate(): void {
        // 飞行动画播放完成切换为idle动画
        if (!this.self.isPlaying) {
            this.self.autoAnimation = 'Idle';
        }
    }

    onTriggerEnter(other: any): void {
        const target: Laya.BoxCollider = other;
        // 碰顶部不会死
        if (target.owner.name === 'collider_top') return;

        this.self.autoAnimation = 'Die';
        this.isGameover = true;
        // 派发gameover事件
        Laya.stage.event('gameover');
    }

    onDestroy(): void {
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        super.destroy();
    }
}