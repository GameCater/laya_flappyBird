/**
* @ data: 2023-01-12 11:28
*/
export default class AutoMove extends Laya.Script {

    /** @prop {name: moveSpeed, type: Number, tips: "背景移动速度", default: 5} */
    public moveSpeed: number = 5;

    private rgBody: Laya.RigidBody;

    constructor() {
        super();
    }

    onAwake() {
        this.rgBody = this.owner.getComponent(Laya.RigidBody);
        this.rgBody.linearVelocity = new Laya.Vector2(-this.moveSpeed, 0);
    }

    onEnable(): void {
        // 侦听gameover
        Laya.stage.on('gameover', this, this.handleGameover);

        Laya.stage.on('gameRestart', this, this.handleGameRestart);
    }

    onDisable(): void {
        Laya.stage.off('gameover', this, this.handleGameover);
    }
    
    private handleGameover(): void {
        this.rgBody.linearVelocity = new Laya.Vector2(0, 0);
    }

    private handleGameRestart(): void {
        this.rgBody.linearVelocity = new Laya.Vector2(-this.moveSpeed, 0);
    }
}