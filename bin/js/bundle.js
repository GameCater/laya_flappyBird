(function () {
    'use strict';

    class AutoMove extends Laya.Script {
        constructor() {
            super();
            this.moveSpeed = 5;
        }
        onAwake() {
            this.rgBody = this.owner.getComponent(Laya.RigidBody);
            this.rgBody.linearVelocity = new Laya.Vector2(-this.moveSpeed, 0);
        }
        onEnable() {
            Laya.stage.on('gameover', this, this.handleGameover);
        }
        onDisable() {
            Laya.stage.off('gameover', this, this.handleGameover);
        }
        handleGameover() {
            this.rgBody.linearVelocity = new Laya.Vector2(0, 0);
        }
    }

    class RepeatingBg extends Laya.Script {
        constructor() {
            super();
            this.BG_WIDTH = 2048;
        }
        onAwake() {
            this.sp = this.owner;
        }
        onUpdate() {
            if (this.sp.x <= -this.BG_WIDTH) {
                this.sp.x += this.BG_WIDTH * 2;
            }
        }
    }

    class BirdFly extends Laya.Script {
        constructor() {
            super();
            this.flySpeed = 10;
            this.isGameover = false;
        }
        onAwake() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.self = this.owner;
        }
        onMouseDown() {
            if (this.isGameover)
                return;
            this.owner.getComponent(Laya.RigidBody).linearVelocity = new Laya.Vector2(0, -this.flySpeed);
            this.self.autoAnimation = 'Fly';
            this.self.loop = false;
        }
        onUpdate() {
            if (!this.self.isPlaying) {
                this.self.autoAnimation = 'Idle';
            }
        }
        onTriggerEnter(other) {
            const target = other;
            if (target.owner.name === 'collider_top')
                return;
            this.self.autoAnimation = 'Die';
            this.isGameover = true;
            Laya.stage.event('gameover');
        }
        onDestroy() {
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            super.destroy();
        }
    }

    class Column extends Laya.Script {
        constructor() {
            super();
            this.canAddScore = true;
            this.scorePoint = 15;
        }
        onAwake() {
            this.parent = this.owner;
        }
        onUpdate() {
            if (this.parent.x <= -210) {
                this.parent.removeSelf();
                Laya.Pool.recover('Column', this.parent);
            }
            if (this.canAddScore && this.parent.x <= this.scorePoint) {
                this.canAddScore = false;
                Laya.stage.event('addScore');
            }
        }
    }

    class ColumnSpawn extends Laya.Script {
        constructor() {
            super();
            this.min = 2000;
            this.max = 2500;
            this.columnPreb = null;
            this.timer = 0;
            this.spawnTime = 2000;
            this.isGameOver = false;
        }
        onAwake() {
            Laya.stage.on('gameover', this, this.handleGameover);
        }
        onUpdate() {
            if (this.isGameOver)
                return;
            this.timer += Laya.timer.delta;
            if (this.timer >= this.spawnTime) {
                this.timer = 0;
                this.spawnTime = this.getRandom(this.min, this.max);
                this.spawn();
            }
        }
        handleGameover() {
            this.isGameOver = true;
        }
        getRandom(min, max) {
            let ret = 0;
            if (min < max) {
                ret = Math.random() * (max - min) + min;
            }
            else {
                ret = Math.random() * (min - max) + max;
            }
            return ret;
        }
        spawn() {
            const bottomColumn = Laya.Pool.getItemByCreateFun('Column', this.createColumnIfNotExist, this);
            bottomColumn.getComponent(Column).canAddScore = true;
            bottomColumn.rotation = 0;
            const bcY = this.getRandom(192, 612);
            bottomColumn.pos(1920, bcY);
            this.owner.addChild(bottomColumn);
            const delta = this.getRandom(170, 490);
            const tcY = bcY - delta;
            const topColumn = Laya.Pool.getItemByCreateFun('Column', this.createColumnIfNotExist, this);
            topColumn.rotation = 180;
            topColumn.pos(2176, tcY);
            topColumn.getComponent(Column).canAddScore = false;
            this.owner.addChild(topColumn);
        }
        createColumnIfNotExist() {
            const temp = this.columnPreb.create();
            temp.zOrder = -1;
            return temp;
        }
        onDestroy() {
            Laya.stage.off('gameover', this, this.handleGameover);
            super.destroy();
        }
    }

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class MainUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("Main");
            }
        }
        ui.MainUI = MainUI;
        REG("ui.MainUI", MainUI);
        class UIUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("UI");
            }
        }
        ui.UIUI = UIUI;
        REG("ui.UIUI", UIUI);
    })(ui || (ui = {}));

    class UIManager extends ui.UIUI {
        constructor() {
            super();
            this.score = 0;
            this.scoreText = `Score: ${this.score}`;
            this.graphics.fillText(this.scoreText, 24, 50, '40px Arial', '#111', 'left');
            Laya.stage.on('addScore', this, this.addScore);
            Laya.stage.on('gameover', this, this.handleGameOver);
        }
        addScore() {
            this.score += 1;
            this.scoreText = `Score: ${this.score}`;
            this.graphics.replaceText(this.scoreText);
        }
        handleGameOver() {
            this.graphics.clear();
            Laya.Tween.from(this.box_finish, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                this.box_finish.visible = true;
                this.btn_restart.on(Laya.Event.MOUSE_DOWN, this, this.handleRestart);
            }));
        }
        handleRestart() {
            console.log('restart');
        }
        onDestroy() {
            Laya.stage.off('addScore', this, this.addScore);
            Laya.stage.off('gameover', this, this.handleGameOver);
            super.destroy();
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/AutoMove.ts", AutoMove);
            reg("scripts/RepeatingBg.ts", RepeatingBg);
            reg("scripts/BirdFly.ts", BirdFly);
            reg("scripts/ColumnSpawn.ts", ColumnSpawn);
            reg("scripts/UIManager.ts", UIManager);
            reg("scripts/Column.ts", Column);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode = "noscale";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "UI.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class MainScene extends ui.MainUI {
        constructor() {
            super();
            this.initial();
        }
        initial() {
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Laya.loader.load('ui.json', Laya.Handler.create(this, (uiJson) => {
                for (const key in uiJson) {
                    Laya.Loader.loadedMap[Laya.URL.formatURL(key + '.scene')] = uiJson[key];
                }
                Laya.loader.load('res/atlas/bird.atlas', Laya.Handler.create(this, () => {
                    Laya.stage.addChild(new MainScene());
                }));
            }));
        }
    }
    new Main();

}());
