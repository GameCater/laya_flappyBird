import { ui } from "../ui/layaMaxUI";

export default class UIManager extends ui.UIUI {

    private score = 0;
    private scoreText = `Score: ${this.score}`;
    private historyScores = [];
    private isStart = false;

    constructor() {
        super();
        Laya.stage.on('addScore', this, this.addScore);
        Laya.stage.on('gameover', this, this.handleGameOver);

        let scores: string | undefined = Laya.LocalStorage.getItem('rank');
        if (!scores) {
            this.historyScores = [0, 0, 0];
        } else {
            this.historyScores = JSON.parse(scores);
        }

        Laya.stage.on(Laya.Event.CLICK, this, this.startGame);
    }

    private startGame(): void {
        if (this.isStart) return;
        this.btn_start.visible = false;
        this.graphics.fillText(this.scoreText, 24, 50, '40px Arial', '#111', 'left');

        Laya.stage.event('gameStart');
        this.isStart = true;
    }

    private addScore(): void {
        this.score += 1;
        this.scoreText = `Score: ${this.score}`;
        this.graphics.replaceText(this.scoreText);
    }

    private handleGameOver(): void {

        // 更新分数排名数组
        this.historyScores.push(this.score);
        this.historyScores = this.historyScores.sort((a, b) => { return b - a; });
        this.historyScores.splice(3, this.historyScores.length - 3);
        Laya.LocalStorage.setItem('rank', JSON.stringify(this.historyScores));

        this.graphics.clear();
        Laya.Tween.from(this.box_finish, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
            this.box_finish.visible = true;
            this.btn_restart.on(Laya.Event.MOUSE_DOWN, this, this.handleRestart);

            this.btn_rank.on(Laya.Event.MOUSE_DOWN, this, this.handleRank);
        }));
    }

    private handleRank(): void {
        this.rank_panel.visible = true;
        this.rank_panel.show();

        this.historyScores = JSON.parse(Laya.LocalStorage.getItem('rank'));

        const desc = "第一名：" + this.historyScores[0] + "分\n"
                    +"第二名：" + this.historyScores[1] + "分\n"
                    +"第三名：" + this.historyScores[2] + "分";
        
        this.txt_info.text = desc;
    }

    private handleRestart(): void {
        this.box_finish.visible = false;
        this.btn_restart.off(Laya.Event.MOUSE_DOWN, this, this.handleRestart);

        this.score = 0;
        this.scoreText = `Score: ${this.score}`;
        this.graphics.fillText(this.scoreText, 24, 50, '40px Arial', '#111', 'left');

        this.stage.event('gameRestart');
    }

    onDestroy(): void {
        Laya.stage.off('addScore', this, this.addScore);
        Laya.stage.off('gameover', this, this.handleGameOver);
        super.destroy();
    }
}