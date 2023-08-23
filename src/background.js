class BackgroundElement {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.scale = 1;
        this.speed = 6;
        this.texture = "";
        this.plan = 1;
    }

    update() {
        this.x -= this.speed * Main.game.speedRatio;
        if (this.x + this.width * this.scale * Main.game.globalScale < 0)
            this.kill();
    }

    render() {
        let opacity = 1;

        if (Main.game.isChangingSeason) {
            opacity =
                Main.game.seasonChangeTick / Main.game.seasonChangeDuration;

            Main.game.ctx.save();
            Main.game.ctx.globalAlpha = 1 - opacity;
            Main.game.ctx.drawImage(
                Main.textures[this.texture + "_" + Main.game.previousSeason],
                this.x,
                this.y,
                this.width * this.scale * Main.game.globalScale,
                this.height * this.scale * Main.game.globalScale
            );
            Main.game.ctx.restore();
        }

        Main.game.ctx.save();
        Main.game.ctx.globalAlpha = opacity;
        Main.game.ctx.drawImage(
            Main.textures[this.texture + "_" + Main.game.season],
            this.x,
            this.y,
            this.width * this.scale * Main.game.globalScale,
            this.height * this.scale * Main.game.globalScale
        );
        Main.game.ctx.restore();
    }

    static orderByPlan(elementsName) {
        Main.game[elementsName].sort((a, b) => {
            if (a.plan > b.plan) return 1;
            if (a.plan < b.plan) return -1;
            return 0;
        });
    }
}

/*
---------------------------------------------------------------------------------------------------
*/
class Cloud extends BackgroundElement {
    constructor(x, y) {
        super(x, y);
        this.width = 200;
        this.height = 100;
        this.scale = Helper.random(80, 180) / 100;
        this.speed = 0.5 / this.scale;
        this.texture = "cloud";
    }

    kill() {
        Main.game.clouds.splice(Main.game.clouds.indexOf(this), 1);
    }

    static getRandomY() {
        return Helper.random(0, Main.game.canvas.height * 0.15);
    }
}

/*
---------------------------------------------------------------------------------------------------
*/
class Tree extends BackgroundElement {
    constructor(x, plan = 1) {
        super(x);
        this.plan = plan;
        this.width = 250;
        this.height = 500;
        this.scale = Helper.random(75, 100) / 100;
        this.speed = 6;
        this.texture = "tree";

        this.y = Main.game.floorHeight - 50 * Main.game.globalScale;
        if (plan == 2) {
            this.y -= 70 * Main.game.globalScale;
            this.speed *= 0.85;
            this.scale *= 0.85;
            this.texture = "tree-2";
        }

        if (plan == 3) {
            this.y -= 150 * Main.game.globalScale;
            this.speed *= 0.7;
            this.scale *= 0.7;
            this.texture = "tree-3";
        }

        this.y -= this.height * this.scale * Main.game.globalScale;
    }

    kill() {
        Main.game.trees.splice(Main.game.trees.indexOf(this), 1);

        Main.game.trees.push(new Tree(Main.game.canvas.width, this.plan));
        BackgroundElement.orderByPlan("trees");
    }
}

/*
---------------------------------------------------------------------------------------------------
*/
class Mountain extends BackgroundElement {
    constructor(x, plan = 1) {
        super(x);
        this.plan = plan;
        this.width = 900;
        this.height = 500;
        this.scale = Helper.random(50, 70) / 100;
        this.speed = 0.3;
        this.texture = "mountain";

        this.y = Main.game.canvas.height * 0.5;
        if (plan == 2) {
            this.speed *= 0.85;
            this.scale += 0.2;
            this.texture = "mountain-2";
        }

        if (plan == 3) {
            this.speed *= 0.7;
            this.scale += 0.4;
            this.texture = "mountain-3";
        }

        this.y -= this.height * this.scale * Main.game.globalScale;
    }

    kill() {
        Main.game.mountains.splice(Main.game.mountains.indexOf(this), 1);

        Main.game.mountains.push(
            new Mountain(Main.game.canvas.width, this.plan)
        );

        BackgroundElement.orderByPlan("mountains");
    }
}
/*
---------------------------------------------------------------------------------------------------
*/
class Hill extends BackgroundElement {
    constructor(x, plan = 1) {
        super(x);
        this.plan = plan;
        this.width = 1000;
        this.height = 160;
        this.scale = Helper.random(50, 70) / 100;
        this.speed = 0.4;
        this.texture = "hill-1";

        this.y =
            Main.game.canvas.height * 0.5 +
            this.height * Main.game.globalScale * 0.3;
        if (plan == 2) {
            this.speed *= 0.85;
            this.scale += 0.2;
            this.y -= 5;
            this.texture = "hill-2";
        }

        if (plan == 3) {
            this.speed *= 0.7;
            this.scale += 0.4;
            this.y -= 10;
            this.texture = "hill-3";
        }

        this.y -= this.height * this.scale * Main.game.globalScale;
    }

    kill() {
        Main.game.hills.splice(Main.game.hills.indexOf(this), 1);

        Main.game.hills.push(new Hill(Main.game.canvas.width, this.plan));

        BackgroundElement.orderByPlan("hills");
    }
}
