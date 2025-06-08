class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");             // Packed tilemap
        this.load.image("tilemap_tiles_2", "normal_tilemap_packed.png");             // Packed tilemap
        this.load.image("tilemap_tiles_3", "farm_tilemap_packed.png");             // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "AllOfMe.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-2", "AllOfMe_stray.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-3", "AllOfMe_sunshine.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-4", "AllOfMe_basalisk.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_sheet_2", "normal_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_sheet_3", "farm_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.        
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("collect", "powerUp2.ogg");
        this.load.audio("walkAudio", "footstep08.ogg");
        this.load.audio("climbAudio", "metalLatch.ogg");
        this.load.audio("jumpAudio", "bookClose.ogg");
        this.load.audio("outcomeW", "win_jingle.ogg");
        this.load.audio("outcome", "loose_jingle.ogg");
        this.load.audio("swimAudio", "cloth4.ogg");
        this.load.audio("nextSceneAudio", "highDown.ogg");
        this.load.audio("teleportAudio", "phaseJump1.ogg");

        //load tutorial sprites
        this.load.image("token1", "tile_0057.png");
        this.load.image("end1", "tile_0060.png");
        this.load.image("token2", "tile_0151.png");
        this.load.image("end2", "tile_0111.png");
        this.load.image("token3", "tile_0056.png");
        this.load.image("end3", "tile_0005.png");
        this.load.image("end4", "tile_0067.png");
        this.load.image("t1", "tile_0009.png");
        this.load.image("t2", "tile_0010.png");
        this.load.image("t3", "tile_0011.png");
        this.load.image("tp1", "tile_0029.png");
        this.load.image("tp2", "tile_0030.png");
        this.load.image("tp3", "tile_0031.png");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        //npc flies
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 24,
                end: 26,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 7,
            repeat: true,
            yoyo: true
        });

         // ...and pass to the next Scene
         this.scene.start("openScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}