class Game {
    start() {
        this.score = 0;
        this.level = 1;
        this.time = 0;
        this.speedRatio = 1.1;
        this.ageInTicks = 0;
        this.obstacles = [];
        this.season = "spring";
        this.previousSeason = "spring";
        this.seasonChangeTick = 0;
        this.seasonChangeDuration = 120;
        this.isChangingSeason = false;
        this.isOver = false;

        let treasures = localStorage.getItem("treasures");
        if (treasures) {
            this.treasures = JSON.parse(treasures);
        } else {
            this.treasures = {};
        }

        this.nextObstacleSpawnAt = 0;
        this.FPS = 120;
        this.frameInterval = 1000 / this.FPS;
        this.lastTimestamp = 0;

        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");

        this.globalScale = this.canvas.height / 1000;

        this.floorHeight = this.canvas.height - 100 * Main.game.globalScale;
        this.chibi = new Chibi();

        document.querySelectorAll(".container").forEach((container) => {
            container.dataset.active = "false";
        });

        document.getElementById("ingame").dataset.active = "true";

        this.clouds = [
            new Cloud(100, Cloud.getRandomY()),
            new Cloud(
                Helper.random(this.canvas.width / 4, this.canvas.width / 2),
                Cloud.getRandomY()
            ),
            new Cloud(
                Helper.random(this.canvas.width / 2, this.canvas.width * 0.75),
                Cloud.getRandomY()
            ),
            new Cloud(this.canvas.width, Cloud.getRandomY()),
        ];
        this.trees = [];
        this.mountains = [];
        this.hills = [];

        let x = 0;
        while (true) {
            let tree = new Tree(x);
            if (tree.x > this.canvas.width) break;
            this.trees.push(tree);
            x += tree.width * tree.scale * Helper.random(1.25, 2);

            this.trees.push(new Tree((x * Helper.random(50, 150)) / 100, 2));

            this.trees.push(new Tree((x * Helper.random(50, 150)) / 100, 3));
        }

        x = 0;
        while (true) {
            let mountain = new Mountain(x);
            if (mountain.x > this.canvas.width) break;
            this.mountains.push(mountain);
            x += mountain.width * mountain.scale * Helper.random(0.75, 1);

            this.mountains.push(
                new Mountain((x * Helper.random(50, 150)) / 100, 2)
            );

            this.mountains.push(
                new Mountain((x * Helper.random(50, 150)) / 100, 3)
            );
        }

        x = 0;
        while (true) {
            let hill = new Hill(x);
            if (x > this.canvas.width) break;
            this.hills.push(hill);
            this.hills.push(new Hill(x, 2));
            this.hills.push(new Hill(x, 3));

            x += hill.width * hill.scale * 0.9;
        }

        BackgroundElement.orderByPlan("trees");
        BackgroundElement.orderByPlan("mountains");
        BackgroundElement.orderByPlan("hills");

        this.backgroundGradient = {};

        this.backgroundGradient.spring = this.ctx.createLinearGradient(
            0,
            this.canvas.height * 0.5,
            0,
            this.canvas.height
        );
        this.backgroundGradient.spring.addColorStop(0, "#a5bd71");
        this.backgroundGradient.spring.addColorStop(1, "#8fad4e");

        this.backgroundGradient.summer = this.ctx.createLinearGradient(
            0,
            this.canvas.height * 0.5,
            0,
            this.canvas.height
        );
        this.backgroundGradient.summer.addColorStop(0, "#6dbf73");
        this.backgroundGradient.summer.addColorStop(1, "#4caf50");

        this.backgroundGradient.autumn = this.ctx.createLinearGradient(
            0,
            this.canvas.height * 0.5,
            0,
            this.canvas.height
        );
        this.backgroundGradient.autumn.addColorStop(0, "#f5a545");
        this.backgroundGradient.autumn.addColorStop(1, "#f28f17");

        this.backgroundGradient.winter = this.ctx.createLinearGradient(
            0,
            this.canvas.height * 0.5,
            0,
            this.canvas.height
        );
        this.backgroundGradient.winter.addColorStop(0, "#e9f2f9");
        this.backgroundGradient.winter.addColorStop(1, "#c2e3f9");

        this.updateTreasureUI();
        this.update();
    }

    claimTreasure(level) {
        this.treasures[level] = true;
        this.save();

        this.updateTreasureUI();
    }

    updateTreasureUI() {
        for (let level = 1; level <= 6; level++) {
            let img = document.getElementById("treasure_" + level);

            if (this.treasures[level]) {
                img.dataset.claimed = "true";
            } else {
                img.dataset.claimed = "false";
            }
        }
    }

    save() {
        localStorage.setItem("treasures", JSON.stringify(this.treasures));
    }

    changeSeason() {
        if (this.isChangingSeason) return;

        this.isChangingSeason = true;
        this.seasonChangeTick = 0;
        this.previousSeason = this.season;

        switch (this.season) {
            case "spring":
                this.season = "summer";
                break;
            case "summer":
                this.season = "autumn";
                break;
            case "autumn":
                this.season = "winter";
                break;
            case "winter":
                this.season = "spring";
                break;
        }
    }

    over() {
        let bestRun = localStorage.getItem("bestRun");
        if (bestRun) {
            bestRun = JSON.parse(bestRun);
        } else {
            bestRun = {
                score: null,
                time: null,
            };
        }

        if (this.score > bestRun.score ?? 0) {
            bestRun.score = this.score;
        }

        if (this.time > bestRun.time ?? 0) {
            bestRun.time = this.time;
        }

        localStorage.setItem("bestRun", JSON.stringify(bestRun));

        this.chibi = null;
        document.getElementById("game_ui").style.display = "none";
        document.getElementById("gamover_score").innerText = this.score
            .toString()
            .padStart(6, "0");

        document.getElementById("gamover_timer").innerText = `${Math.floor(
            this.time / 60
        )
            .toString()
            .padStart(2, "0")}:${(this.time % 60).toString().padStart(2, "0")}`;

        document.getElementById("gamover_score_best").innerText = bestRun.score
            .toString()
            .padStart(6, "0");

        document.getElementById("gamover_timer_best").innerText = `${Math.floor(
            bestRun.time / 60
        )
            .toString()
            .padStart(2, "0")}:${(bestRun.time % 60)
            .toString()
            .padStart(2, "0")}`;

        if (Main.showWishes && localStorage.getItem("wishes") != "true") {
            document
                .getElementById("wishes")
                .addEventListener("animationend", () => {
                    document.getElementById("gameover").style.display = "";
                    document.getElementById("wishes").style.display = "none";
                    localStorage.setItem("wishes", "true");
                });
            document.getElementById("wishes").dataset.active = "true";
        } else {
            document.getElementById("gameover").style.display = "";
        }
    }

    setNextObstacleSpawnAt() {
        this.nextObstacleSpawnAt =
            this.ageInTicks +
            Math.floor(Helper.random(1 * 60, 4 * 60) / this.speedRatio);
    }

    canSpawnObstacle() {
        return this.ageInTicks > this.nextObstacleSpawnAt;
    }

    spawnClouds() {
        if (this.clouds.length > 3) return;

        let x = Helper.random(this.canvas.width, this.canvas.width * 1.5);
        let y = Cloud.getRandomY();
        this.clouds.push(new Cloud(x, y));
    }

    update(timestamp) {
        const elapsed = timestamp - this.lastTimestamp;
        if (elapsed >= this.frameInterval) {
            this.ageInTicks++;
            if (this.isChangingSeason) {
                this.seasonChangeTick++;

                if (this.seasonChangeTick >= this.seasonChangeDuration) {
                    this.isChangingSeason = false;
                }
            }

            if (this.ageInTicks % 60 === 0) {
                this.time++;
                this.score += 10;
            }

            this.chibi?.update();
            for (let i = this.obstacles.length - 1; i >= 0; i--) {
                this.obstacles[i].update();
            }

            for (let i = this.clouds.length - 1; i >= 0; i--) {
                this.clouds[i].update();
            }

            for (let i = this.trees.length - 1; i >= 0; i--) {
                this.trees[i].update();
            }

            for (let i = this.mountains.length - 1; i >= 0; i--) {
                this.mountains[i].update();
            }

            for (let i = this.hills.length - 1; i >= 0; i--) {
                this.hills[i].update();
            }

            if (this.canSpawnObstacle()) {
                this.obstacles.push(new Obstacle());
                this.setNextObstacleSpawnAt();
            }

            this.spawnClouds();

            // every 5 seconds
            if (this.ageInTicks % (60 * 5) === 0) {
                this.speedRatio += 0.0375;
            }

            // every minute
            if (this.ageInTicks % (60 * 60) === 0) {
                if (this.chibi) this.obstacles.push(new Treasure(this.level));
                this.changeSeason();
                this.level++;
            }

            this.render();

            this.lastTimestamp = timestamp;
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.fillStyle = "#b3e5fc";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        for (let i = this.mountains.length - 1; i >= 0; i--) {
            this.mountains[i].render();
        }

        this.renderGround();

        for (let i = this.trees.length - 1; i >= 0; i--) {
            this.trees[i].render();
        }

        for (let i = this.clouds.length - 1; i >= 0; i--) {
            this.clouds[i].render();
        }

        this.chibi?.render();

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].render();
        }

        let lives_container = document.getElementById("lives");
        if (lives_container.innerText != this.chibi?.lives) {
            lives_container.innerText = this.chibi?.lives;
        }

        let timer_container = document.getElementById("timer");
        let minutes = Math.floor(this.time / 60);
        let seconds = this.time % 60;
        let time = `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
        if (timer_container.innerText != time) {
            timer_container.innerText = time;
        }

        let score_container = document.getElementById("score");
        let score = this.score.toString().padStart(6, "0");
        if (score_container.innerText != score) {
            score_container.innerText = score;
        }
    }

    renderGround() {
        let opacity = 1;

        if (this.isChangingSeason) {
            opacity = this.seasonChangeTick / this.seasonChangeDuration;

            this.ctx.save();
            this.ctx.fillStyle = this.backgroundGradient[this.previousSeason];
            this.ctx.globalAlpha = 1 - opacity;
            this.ctx.fillRect(
                0,
                this.canvas.height * 0.5,
                this.canvas.width,
                this.canvas.height
            );
            this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.fillStyle = this.backgroundGradient[this.season];
        this.ctx.globalAlpha = opacity;
        this.ctx.fillRect(
            0,
            this.canvas.height * 0.5,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.restore();

        for (let i = this.hills.length - 1; i >= 0; i--) {
            this.hills[i].render();
        }
    }
}
