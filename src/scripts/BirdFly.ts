/**
* @ data: 2023-01-12 15:46
*/
export default class BirdFly extends Laya.Script {

    /** @prop {name: flySpeed, type: Number, tips: '小鸟向上飞行的速度', default: 10} */
    public flySpeed = 10;
    private self: Laya.Animation;
    private isGameover = false;

    private rgBody: Laya.RigidBody;
    private isGameStart = false;

    constructor() {
        super();
    }

    onAwake() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.self = this.owner as Laya.Animation;

        Laya.stage.on('gameRestart', this, this.handleGameRestart);
        this.rgBody = this.owner.getComponent(Laya.RigidBody) as Laya.RigidBody;

        this.rgBody.type = 'static';
        Laya.stage.on('gameStart', this, this.handleGameStart);
    }

    private handleGameStart(): void {
        this.rgBody.type = 'dynamic';
        this.isGameStart = true;
    }

    private handleGameRestart(): void {
        this.self.pos(247, 490);
        this.self.rotation = 0;
        this.self.autoAnimation = 'Idle';

        this.isGameover = false;
    }

    onMouseDown(): void {
        if (this.isGameover || !this.isGameStart) return;
        // 施加一个向上的力
        this.rgBody.linearVelocity = new Laya.Vector2(0, -this.flySpeed);
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
        // 避免重复碰撞
        if (this.isGameover) return;

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