import { ui } from "../ui/layaMaxUI";

export default class UIManager extends ui.UIUI {

    private score = 0;
    private scoreText = `Score: ${this.score}`;

    constructor() {
        super();
        this.graphics.fillText(this.scoreText, 24, 50, '40px Arial', '#111', 'left');
        Laya.stage.on('addScore', this, this.addScore);
        Laya.stage.on('gameover', this, this.handleGameOver);
    }

    private addScore(): void {
        this.score += 1;
        this.scoreText = `Score: ${this.score}`;
        this.graphics.replaceText(this.scoreText);
    }

    private handleGameOver(): void {
        this.graphics.clear();
        Laya.Tween.from(this.box_finish, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
            this.box_finish.visible = true;
            this.btn_restart.on(Laya.Event.MOUSE_DOWN, this, this.handleRestart);
        }));
    }

    private handleRestart(): void {
        console.log('restart');
        
    }

    onDestroy(): void {
        Laya.stage.off('addScore', this, this.addScore);
        Laya.stage.off('gameover', this, this.handleGameOver);
        super.destroy();
    }
}