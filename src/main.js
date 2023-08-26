class Main {
    static main() {
        Main.textures = {};
        Main.sounds = {};
        Main.DELTA = 60 / 1000;

        Main.initEventListeners();
        Main.loadAssets();

        Main.game = new Game();
    }

    static initEventListeners() {
        document
            .getElementById("start")
            .addEventListener("click", () => Main.game.start());

        window.addEventListener("keydown", (event) => {
            if (
                event.key === "ArrowUp" ||
                event.key === "w" ||
                event.key === " "
            ) {
                this.game.chibi?.jump();
            }
        });
    }

    static loadAssets() {
        Main.textures.chibi = new Image();
        Main.textures.chibi.src = "assets/textures/chibi.png";

        /*
        ===================================================================================================
        ======================================== S P R I N G ==============================================
        ===================================================================================================
        */
        Main.textures.obstacle_spring = new Image();
        Main.textures.obstacle_spring.src =
            "assets/textures/obstacle_spring.png";

        Main.textures.cloud_spring = new Image();
        Main.textures.cloud_spring.src = "assets/textures/cloud.png";

        Main.textures.tree_spring = new Image();
        Main.textures.tree_spring.src = "assets/textures/tree_spring.png";
        Main.textures.tree_spring.onload = () => {
            Main.textures["tree-2_spring"] = Main.createAssetDepthVariant(
                Main.textures.tree_spring,
                1
            );

            Main.textures["tree-3_spring"] = Main.createAssetDepthVariant(
                Main.textures.tree_spring,
                2
            );
        };

        Main.textures.mountain_spring = new Image();
        Main.textures.mountain_spring.src =
            "assets/textures/mountain_spring.png";
        Main.textures.mountain_spring.onload = () => {
            Main.textures["mountain-2_spring"] = Main.createAssetDepthVariant(
                Main.textures.mountain_spring,
                1
            );

            Main.textures["mountain-3_spring"] = Main.createAssetDepthVariant(
                Main.textures.mountain_spring,
                2
            );
        };

        Main.textures.hill_spring = new Image();
        Main.textures.hill_spring.src = "assets/textures/hill_spring.png";
        Main.textures.hill_spring.onload = () => {
            Main.textures["hill-1_spring"] = Main.createAssetDepthVariant(
                Main.textures.hill_spring,
                1
            );

            Main.textures["hill-2_spring"] = Main.createAssetDepthVariant(
                Main.textures.hill_spring,
                2
            );

            Main.textures["hill-3_spring"] = Main.createAssetDepthVariant(
                Main.textures.hill_spring,
                3
            );
        };

        /*
        ===================================================================================================
        ======================================== S U M M E R ==============================================
        ===================================================================================================
        */
        Main.textures.obstacle_summer = new Image();
        Main.textures.obstacle_summer.src =
            "assets/textures/obstacle_summer.png";

        Main.textures.cloud_summer = new Image();
        Main.textures.cloud_summer.src = "assets/textures/cloud.png";

        Main.textures.tree_summer = new Image();
        Main.textures.tree_summer.src = "assets/textures/tree_summer.png";
        Main.textures.tree_summer.onload = () => {
            Main.textures["tree-2_summer"] = Main.createAssetDepthVariant(
                Main.textures.tree_summer,
                1
            );

            Main.textures["tree-3_summer"] = Main.createAssetDepthVariant(
                Main.textures.tree_summer,
                2
            );
        };

        Main.textures.mountain_summer = new Image();
        Main.textures.mountain_summer.src =
            "assets/textures/mountain_summer.png";
        Main.textures.mountain_summer.onload = () => {
            Main.textures["mountain-2_summer"] = Main.createAssetDepthVariant(
                Main.textures.mountain_summer,
                1
            );

            Main.textures["mountain-3_summer"] = Main.createAssetDepthVariant(
                Main.textures.mountain_summer,
                2
            );
        };

        Main.textures.hill_summer = new Image();
        Main.textures.hill_summer.src = "assets/textures/hill_summer.png";
        Main.textures.hill_summer.onload = () => {
            Main.textures["hill-1_summer"] = Main.createAssetDepthVariant(
                Main.textures.hill_summer,
                1
            );

            Main.textures["hill-2_summer"] = Main.createAssetDepthVariant(
                Main.textures.hill_summer,
                2
            );

            Main.textures["hill-3_summer"] = Main.createAssetDepthVariant(
                Main.textures.hill_summer,
                3
            );
        };

        /*
        ===================================================================================================
        ======================================== A U T U M N ==============================================
        ===================================================================================================
        */
        Main.textures.obstacle_autumn = new Image();
        Main.textures.obstacle_autumn.src =
            "assets/textures/obstacle_autumn.png";

        Main.textures.cloud_autumn = new Image();
        Main.textures.cloud_autumn.src = "assets/textures/cloud.png";

        Main.textures.tree_autumn = new Image();
        Main.textures.tree_autumn.src = "assets/textures/tree_autumn.png";
        Main.textures.tree_autumn.onload = () => {
            Main.textures["tree-2_autumn"] = Main.createAssetDepthVariant(
                Main.textures.tree_autumn,
                1
            );

            Main.textures["tree-3_autumn"] = Main.createAssetDepthVariant(
                Main.textures.tree_autumn,
                2
            );
        };

        Main.textures.mountain_autumn = new Image();
        Main.textures.mountain_autumn.src =
            "assets/textures/mountain_autumn.png";
        Main.textures.mountain_autumn.onload = () => {
            Main.textures["mountain-2_autumn"] = Main.createAssetDepthVariant(
                Main.textures.mountain_autumn,
                1
            );

            Main.textures["mountain-3_autumn"] = Main.createAssetDepthVariant(
                Main.textures.mountain_autumn,
                2
            );
        };

        Main.textures.hill_autumn = new Image();
        Main.textures.hill_autumn.src = "assets/textures/hill_autumn.png";
        Main.textures.hill_autumn.onload = () => {
            Main.textures["hill-1_autumn"] = Main.createAssetDepthVariant(
                Main.textures.hill_autumn,
                1
            );

            Main.textures["hill-2_autumn"] = Main.createAssetDepthVariant(
                Main.textures.hill_autumn,
                2
            );

            Main.textures["hill-3_autumn"] = Main.createAssetDepthVariant(
                Main.textures.hill_autumn,
                3
            );
        };

        /*
        ===================================================================================================
        ======================================== W I N T E R ==============================================
        ===================================================================================================
        */
        Main.textures.obstacle_winter = new Image();
        Main.textures.obstacle_winter.src =
            "assets/textures/obstacle_winter.png";

        Main.textures.footstep_winter = new Image();
        Main.textures.footstep_winter.src =
            "assets/textures/footstep_winter.png";

        Main.textures.cloud_winter = new Image();
        Main.textures.cloud_winter.src = "assets/textures/cloud_winter.png";

        Main.textures.tree_winter = new Image();
        Main.textures.tree_winter.src = "assets/textures/tree_winter.png";
        Main.textures.tree_winter.onload = () => {
            Main.textures["tree-2_winter"] = Main.createAssetDepthVariant(
                Main.textures.tree_winter,
                1
            );

            Main.textures["tree-3_winter"] = Main.createAssetDepthVariant(
                Main.textures.tree_winter,
                2
            );
        };

        Main.textures.mountain_winter = new Image();
        Main.textures.mountain_winter.src =
            "assets/textures/mountain_winter.png";
        Main.textures.mountain_winter.onload = () => {
            Main.textures["mountain-2_winter"] = Main.createAssetDepthVariant(
                Main.textures.mountain_winter,
                1
            );

            Main.textures["mountain-3_winter"] = Main.createAssetDepthVariant(
                Main.textures.mountain_winter,
                2
            );
        };

        Main.textures.hill_winter = new Image();
        Main.textures.hill_winter.src = "assets/textures/hill_winter.png";
        Main.textures.hill_winter.onload = () => {
            Main.textures["hill-1_winter"] = Main.createAssetDepthVariant(
                Main.textures.hill_winter,
                1
            );

            Main.textures["hill-2_winter"] = Main.createAssetDepthVariant(
                Main.textures.hill_winter,
                2
            );

            Main.textures["hill-3_winter"] = Main.createAssetDepthVariant(
                Main.textures.hill_winter,
                3
            );
        };

        Main.textures.chibi_shadow = new Image();
        Main.textures.chibi_shadow.src = "assets/textures/chibi_shadow.png";

        Main.textures.shine = new Image();
        Main.textures.shine.src = "assets/textures/shine.png";

        Main.textures.ramen = new Image();
        Main.textures.ramen.src = "assets/textures/ramen.png";

        Main.sounds.hurt = new Audio();
        Main.sounds.hurt.src = "assets/sounds/hurt.mp3";
        Main.sounds.hurt.volume = 0.5;

        Main.sounds.death = new Audio();
        Main.sounds.death.src = "assets/sounds/death.mp3";

        Main.sounds.jump = new Audio();
        Main.sounds.jump.src = "assets/sounds/jump.mp3";
    }

    static createAssetDepthVariant(asset, depth) {
        let canvas = document.createElement("canvas");
        canvas.width = asset.width;
        canvas.height = asset.height;

        let ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(asset, 0, 0);
        ctx.globalCompositeOperation = "source-atop";

        ctx.fillStyle = "#b3e5fc";
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1 - (5 - depth) / 5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.restore();

        return canvas;
    }
}
Main.main();
