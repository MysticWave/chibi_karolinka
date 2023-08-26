class Obstacle {
    constructor() {
        this.x = Main.game.canvas.width;
        this.y = Main.game.floorHeight;
        this.width = 40 * Main.game.globalScale;
        this.height = 100 * Main.game.globalScale;
        this.collided = false;
        this.spd = 6;

        this.textureSize = this.height * 1.4;
    }

    update() {
        this.x -= this.spd * Main.game.speedRatio;
        this.checkChibiCollision();

        if (this.x + this.textureSize + this.width < 0) this.kill();
    }

    onCollision() {
        this.collided = true;
        Main.game.chibi.hurt();
    }

    checkChibiCollision() {
        if (this.collided) return;
        let chibi = Main.game.chibi;
        if (!chibi) return;

        let x1 = chibi.hitBox.x;
        let y1 = chibi.hitBox.y - chibi.height;
        let sx1 = x1 + chibi.hitBox.width;
        let sy1 = y1 + chibi.hitBox.height;

        let x2 = this.x;
        let y2 = this.y - this.height;
        let sx2 = this.x + this.width;
        let sy2 = y2 + this.height;

        if (
            ((x1 >= x2 && x1 <= sx2) || (x2 >= x1 && x2 <= sx1)) &&
            ((y1 >= y2 && y1 <= sy2) || (y2 >= y1 && y2 <= sy1))
        ) {
            this.onCollision();
        }
    }

    render() {
        // Main.game.ctx.save();
        // Main.game.ctx.fillStyle = "red";
        // Main.game.ctx.fillRect(
        //     this.x,
        //     this.y - this.height,
        //     this.width,
        //     this.height
        // );
        // Main.game.ctx.restore();

        let opacity = 1;

        if (Main.game.isChangingSeason) {
            opacity =
                Main.game.seasonChangeTick / Main.game.seasonChangeDuration;

            Main.game.ctx.save();
            Main.game.ctx.globalAlpha = 1 - opacity;
            Main.game.ctx.drawImage(
                Main.textures["obstacle_" + Main.game.previousSeason],
                this.x - this.width * 0.8,
                this.y - this.height,
                this.textureSize,
                this.textureSize
            );
            Main.game.ctx.restore();
        }

        Main.game.ctx.save();
        Main.game.ctx.globalAlpha = opacity;
        Main.game.ctx.drawImage(
            Main.textures["obstacle_" + Main.game.season],
            this.x - this.width * 0.8,
            this.y - this.height,
            this.textureSize,
            this.textureSize
        );
        Main.game.ctx.restore();
    }

    kill() {
        Main.game.obstacles.splice(Main.game.obstacles.indexOf(this), 1);
    }
}

/*
---------------------------------------------------------------------------------------------------
*/
class Treasure extends Obstacle {
    constructor(level) {
        super();
        if (level > 6) level = 6;

        this.level = level;
        this.width = 60 * Main.game.globalScale;
        this.height = 60 * Main.game.globalScale;

        this.y = Main.game.floorHeight - Main.game.chibi.height - this.height;
        this.spd = 3;
        this.texture = Main.textures.ramen;

        switch (level) {
            case 1:
                this.texture = Main.textures.bubble_tea;
                break;
            case 2:
                this.texture = Main.textures.tiramisu;
                break;
            case 3:
                this.texture = Main.textures.lollipop;
                break;
            case 4:
                this.texture = Main.textures.sushi;
                break;
            case 5:
                this.texture = Main.textures.ramen;
                break;
            case 6:
                this.texture = Main.textures.ring;
                break;
        }
    }

    onCollision() {
        this.kill();
        Main.game.chibi.lives += 3;
        Main.game.score += 100 * this.level;

        this.summonTreasure();
        this.summonHearts();
    }

    summonTreasure() {
        let treasureTo = document
            .getElementById("treasure_" + this.level)
            .getBoundingClientRect();

        let treasure = document.createElement("img");
        treasure.className = "particle";

        let x = this.x + this.width / 2 + Helper.random(0, 100) - 50;
        let y = this.y + this.height / 2 + Helper.random(0, 100) - 50;

        treasure.style.setProperty("--from-x", x + "px");
        treasure.style.setProperty("--from-y", y + "px");

        treasure.style.setProperty("--to-x", treasureTo.x + "px");
        treasure.style.setProperty("--to-y", treasureTo.y + "px");

        treasure.src = this.texture.src;

        treasure.onanimationend = () => {
            treasure.remove();
            Main.game.claimTreasure(this.level);
        };

        document.body.appendChild(treasure);
    }

    summonHearts() {
        let heartTo = document
            .getElementById("lives_container")
            .getBoundingClientRect();

        for (let i = 0; i < 3; i++) {
            let heart = document.createElement("img");
            heart.className = "particle";

            let x = this.x + this.width / 2 + Helper.random(0, 100) - 50;
            let y = this.y + this.height / 2 + Helper.random(0, 100) - 50;

            heart.style.setProperty("--from-x", x + "px");
            heart.style.setProperty("--from-y", y + "px");

            heart.style.setProperty("--to-x", heartTo.x + "px");
            heart.style.setProperty("--to-y", heartTo.y + "px");

            heart.src = "assets/textures/heart.png";

            heart.onanimationend = () => {
                heart.remove();
            };

            document.body.appendChild(heart);
        }
    }

    render() {
        let shine = Main.textures.shine;
        let rotation = ((Main.game.ageInTicks % 60) / 60) * 360;
        let scale = 2 + Math.sin((Main.game.ageInTicks % 30) / 30) * 2;
        let alpha = 0.5 + Math.sin((Main.game.ageInTicks % 30) / 30) * 0.5;

        Main.game.ctx.save();
        Main.game.ctx.globalAlpha = alpha;
        Main.game.ctx.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        Main.game.ctx.rotate(rotation);
        Main.game.ctx.scale(scale, scale);
        Main.game.ctx.drawImage(
            shine,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        Main.game.ctx.restore();

        Main.game.ctx.drawImage(
            this.texture,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
