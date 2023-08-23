class Obstacle {
    constructor() {
        this.x = Main.game.canvas.width;
        this.y = Main.game.floorHeight;
        this.width = 20 * Main.game.globalScale;
        this.height = 60 * Main.game.globalScale;
        this.collided = false;
        this.spd = 6;
    }

    update() {
        this.x -= this.spd * Main.game.speedRatio;
        this.checkChibiCollision();

        if (this.x + this.width < 0) this.kill();
    }

    onCollision() {
        this.collided = true;
        Main.game.chibi.hurt();
    }

    checkChibiCollision() {
        if (this.collided) return;
        let chibi = Main.game.chibi;

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
        Main.game.ctx.save();
        Main.game.ctx.fillStyle = "red";
        Main.game.ctx.fillRect(
            this.x,
            this.y - this.height,
            this.width,
            this.height
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
        this.level = level;
        this.width = 60 * Main.game.globalScale;
        this.height = 60 * Main.game.globalScale;

        this.y = Main.game.floorHeight - Main.game.chibi.height - this.height;
        this.spd = 3;
        this.texture = Main.textures.ramen;
    }

    onCollision() {
        this.kill();
        Main.game.chibi.lives += 3;
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