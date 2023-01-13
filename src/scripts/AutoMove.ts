/**
* @ data: 2023-01-12 11:28
*/
export default class AutoMove extends Laya.Script {

    /** @prop {name: moveSpeed, type: Number, tips: "背景移动速度", default: 5} */
    public moveSpeed: number = 5;

    constructor() {
        super();
    }

    private rgBody: Laya.RigidBody;
    onAwake() {
        this.rgBody = this.owner.getComponent(Laya.RigidBody);
        this.rgBody.linearVelocity = new Laya.Vector2(-this.moveSpeed, 0);
    }

    onEnable(): void {
        // 侦听gameover
        Laya.stage.on('gameover', this, this.handleGameover);
    }

    onDisable(): void {
        Laya.stage.off('gameover', this, this.handleGameover);
    }
    
    private handleGameover(): void {
        this.rgBody.linearVelocity = new Laya.Vector2(0, 0);
    }
}