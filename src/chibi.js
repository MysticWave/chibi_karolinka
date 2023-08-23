class Chibi {
    constructor() {
        this.lives = 3;
        this.y = Main.game.floorHeight;
        this.x = 100 * Main.game.globalScale;
        this.width = 200 * Main.game.globalScale;
        this.height = 200 * Main.game.globalScale;
        this.texture = "chibi";

        this.jumpHeight = this.height * 1.5;
        this.jumpDuration = 20;
        this.jumpStartAt = 0;
        this.jumpEndAt = -9999;
        this.isJumping = false;
        this.jumpProgress = 0;
        this.hurtAt = 0;

        this.hitBox = {
            x: this.x + 50,
            y: this.y,
            width: this.width - 100,
            height: this.height,
        };

        this.footSteps = [];
        this.lastFootStepWasOdd = false;
    }

    isInvincible() {
        return Main.game.ageInTicks - this.hurtAt < 60;
    }

    jump() {
        if (
            this.isJumping ||
            Main.game.ageInTicks - this.jumpEndAt < this.jumpDuration
        )
            return;

        this.isJumping = true;
        this.jumpStartAt = Main.game.ageInTicks;
        Main.sounds.jump.play();
    }

    endJump() {
        this.isJumping = false;
        this.jumpEndAt = Main.game.ageInTicks;
    }

    update() {
        for (let i = 0; i < this.footSteps.length; i++) {
            this.footSteps[i].update();
            if (this.footSteps[i].x < -this.footSteps[i].width) {
                this.footSteps.splice(i, 1);
                i--;
            }
        }

        let ratio = 0;
        if (this.isJumping) {
            let jumpTick = Main.game.ageInTicks - this.jumpStartAt;
            if (jumpTick < this.jumpDuration) {
                let p = jumpTick / this.jumpDuration;
                this.jumpProgress = 1 - (1 - p) ** 2; // ease out
            } else {
                this.jumpProgress = 1;
                this.endJump();
            }
        } else {
            let p = (Main.game.ageInTicks - this.jumpEndAt) / this.jumpDuration;
            this.jumpProgress = 1 - p ** 2; // ease in

            if (Main.game.ageInTicks % 20 == 0) {
                this.footSteps.push(
                    new FootStep(
                        this.x + this.width / 2,
                        this.y,
                        this.lastFootStepWasOdd
                    )
                );
                this.lastFootStepWasOdd = !this.lastFootStepWasOdd;
            }
        }

        if (this.jumpProgress < 0) this.jumpProgress = 0;
        if (this.jumpProgress > 1) this.jumpProgress = 1;

        this.y = Main.game.floorHeight - this.jumpHeight * this.jumpProgress;
        if (this.y > Main.game.floorHeight) this.y = Main.game.floorHeight;

        this.hitBox.y = this.y;
    }

    hurt() {
        if (this.isInvincible()) return;

        this.hurtAt = Main.game.ageInTicks;
        this.lives--;
        if (this.lives <= 0) {
            Main.sounds.death.play();
            Main.game.over();
            return;
        }

        Main.sounds.hurt.play();
    }

    render() {
        for (let i = 0; i < this.footSteps.length; i++) {
            this.footSteps[i].render();
        }

        Main.game.ctx.save();
        let scale = 1 + this.jumpProgress / 2;
        Main.game.ctx.globalAlpha = 1 - this.jumpProgress / 2;
        Main.game.ctx.drawImage(
            Main.textures.chibi_shadow,
            this.x - (this.width * scale - this.width) / 2,
            Main.game.floorHeight - 10 - (30 * scale - 30),
            this.width * scale,
            30 * scale
        );

        Main.game.ctx.restore();

        Main.game.ctx.save();

        if (this.isInvincible()) {
            let alpha = Main.game.ageInTicks % 10 > 5 ? 0.5 : 1;
            Main.game.ctx.globalAlpha = alpha;
        }

        let tickRatio = 5 / (Main.game.speedRatio / 2);
        if (tickRatio < 1) tickRatio = 1;
        if (tickRatio > 5) tickRatio = 5;

        let animationTick = Math.floor(Main.game.ageInTicks / tickRatio);
        let frame = 7 - (animationTick % 8);

        Main.game.ctx.drawImage(
            Main.textures[this.texture],
            frame * 200,
            0,
            200,
            200,
            this.x,
            this.y - this.height,
            this.width,
            this.height
        );

        // Main.game.ctx.fillStyle = "red";
        // Main.game.ctx.fillRect(
        //     this.hitBox.x,
        //     this.hitBox.y - this.hitBox.height,
        //     this.hitBox.width,
        //     this.hitBox.height
        // );

        Main.game.ctx.restore();
    }
}

/*
---------------------------------------------------------------------------------------------------
*/
class FootStep {
    constructor(x, y, odd = false) {
        this.x = x;
        this.y = y;
        this.width = 20 * Main.game.globalScale;
        this.height = 12 * Main.game.globalScale;
        this.texture = "footstep";

        if (odd) {
            this.y += this.height * Main.game.globalScale;
        }
    }

    update() {
        this.x -= 7 * Main.game.speedRatio;
    }

    render() {
        if (Main.game.season === "winter") {
            Main.game.ctx.save();
            Main.game.ctx.drawImage(
                Main.textures[this.texture + "_" + Main.game.season],
                this.x,
                this.y - this.height,
                this.width,
                this.height
            );
            Main.game.ctx.restore();
        }
    }
}
