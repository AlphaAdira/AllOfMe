class Platformer2 extends Phaser.Scene {
    constructor() {
        super("platformer2Scene");
        this.myHealth = 100;
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 100 tiles wide and 50 tiles tall.
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 100, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("normal_tilemap_packed", "tilemap_tiles_2");

        // Create a layer
        this.wallLayer = this.map.createLayer("walls", this.tileset, 0, 0);
        this.backLayer2 = this.map.createLayer("backgrounds 2", this.tileset, 0, 0);
        this.backLayer1 = this.map.createLayer("backgrounds 1", this.tileset, 0, 0);
        this.deathLayer = this.map.createLayer("water", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platforms", this.tileset, 0, 0);
        this.tpLocationsLayer = this.map.createLayer("teleports", this.tileset, 0, 0);
        this.teleport9Layer = this.map.createLayer("teleport9", this.tileset, 0, 0);
        this.teleport10Layer = this.map.createLayer("teleport10", this.tileset, 0, 0);
        this.teleport11Layer = this.map.createLayer("teleport11", this.tileset, 0, 0);

        // Make it collidable - platforms
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Make it collidable - acid
        this.deathLayer.setCollisionByProperty({
            death: true
        });

        // Make it collidable - t9
        this.teleport9Layer.setCollisionByProperty({
            t9: true
        });

        // Make it collidable - t10
        this.teleport10Layer.setCollisionByProperty({
            t10: true
        });

        // Make it collidable - t11
        this.teleport11Layer.setCollisionByProperty({
            t11: true
        });

        this.coins = this.map.createFromObjects("tokens", {
            name: "token",
            key: "tilemap_sheet_2",
            frame: 151
        });

        this.done = this.map.createFromObjects("end", {
            name: "treasure",
            key: "tilemap_sheet_2",
            frame: 111
        });

        // TODO: Add turn into Arcade Physics here
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.done, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);
        this.theend = this.add.group(this.done);
        this.walkSound = this.sound.add("walkAudio", {
            volume: .3,
            detune: 1200
        });
        this.wait = this.sound.add("walkAudio", {
            volume: 0
        });

        ////////////////////
        // Particles!!!
        ////////////////////
        this.vfx = {};

        this.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png'],
            scale: {start: 0.01, end: 0.05},
            lifespan: 500,
            alpha: {start: 1, end: 0.1}, 
        });
        this.vfx.walking.stop();

        this.vfx.hop = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_03.png'],
            scale: {start: 0.05, end: 0.15},
            lifespan: 500,
            alpha: {start: 1, end: 0.1}, 
        });
        this.vfx.hop.stop();


        this.vfx.pool = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_03.png'],
            scale: {start: 0.01, end: 0.05},
            lifespan: 700,
            maxParticles: 100,
            alpha: {start: 1, end: 0.1}, 
            x: { min: 0, max: 1800 },
            y: {start: 780, end: 740}
        });
        this.vfx.pool.start();


        this.vfx.coin = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_03.png'],
            scale: {start: 0.1, end: 0.01},
            maxAliveParticles: 1,
            lifespan: 200,
            duration: 200,
            alpha: {start: 1, end: 0.1}, 
        });
        this.vfx.coin.stop();


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(20, 400, "platformer_characters", "tile_0000.png")
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            console.log(score);
            this.myHealth = 100;
            my.text.health.setText(this.myHealth);
            this.sound.play("collect", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.vfx.coin.x = obj2.x;
            this.vfx.coin.y = obj2.y;
            this.vfx.coin.start();
        });

        this.physics.add.overlap(my.sprite.player, this.theend, (obj1, obj2) => {
            score += this.myHealth;
            this.myHealth = 100;
            this.scene.start("tutorial3Scene");
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();


        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(4);

        /////////////
        // SCORE TEXT
        ////////////
        my.text.health = this.add.text(20, 350, this.myHealth, {
            font: 'bold 15px "Comic Sans MS", sans-serif',
            fill: 'red',
            stroke: '#ffffff', // Outline color (black)
            strokeThickness: 2, // Thickness of the outline
            wordWrap: {
                width: 1800
            }
        });
        
        this.animatedTiles.init(this.map);
        this.physics.world.TILE_BIAS = 36;
    }

    update() {
        if(cursors.left.isDown) {
            if (my.sprite.player.body.velocity.x > -400){
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityX(-400);
            }
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if(my.sprite.player.body.blocked.down){
                if (!this.walkSound.isPlaying){
                    this.walkSound.play();
                    this.myHealth-=2;
                    my.text.health.setText(this.myHealth);
                }
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                this.vfx.walking.start();
            } else {
                this.vfx.walking.stop();
            }
            

        } else if(cursors.right.isDown) {
            if (my.sprite.player.body.velocity.x < 400){
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityX(400);
            }
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if(my.sprite.player.body.blocked.down){
                if (!this.walkSound.isPlaying){
                    this.walkSound.play();
                    this.myHealth-=2;
                    my.text.health.setText(this.myHealth);
                }
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                this.vfx.walking.start();
            } else {
                this.vfx.walking.stop();
            }

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            this.walkSound.pause();
            this.vfx.walking.stop();
            if (my.sprite.player.body.blocked.down) {
                if (!this.wait.isPlaying){
                    this.wait.play();
                    if (this.myHealth < 100){
                        this.myHealth+=1;
                        my.text.health.setText(this.myHealth);
                    }
                }
            }
        }
        
        let playerTeleport1Tile = this.teleport11Layer.worldToTileXY(my.sprite.player.x, my.sprite.player.y);
        let tileOne = this.teleport11Layer.getTileAt(playerTeleport1Tile.x, playerTeleport1Tile.y);
        if(tileOne && tileOne.index !== -1){
            this.sound.play("teleportAudio", {
                volume: .5,
                detune: 1200
            });
            my.sprite.player.x = 98*18;
            my.sprite.player.y = 27*18;
        }
        
        let playerTeleport2Tile = this.teleport10Layer.worldToTileXY(my.sprite.player.x, my.sprite.player.y);
        let tileTwo = this.teleport10Layer.getTileAt(playerTeleport2Tile.x, playerTeleport2Tile.y);
        if(tileTwo && tileTwo.index !== -1){
            this.sound.play("teleportAudio", {
                volume: .5,
                detune: 1200
            });
            my.sprite.player.x = 92*18;
            my.sprite.player.y = 5*18;
        }
        
        let playerTeleport3Tile = this.teleport9Layer.worldToTileXY(my.sprite.player.x, my.sprite.player.y);
        let tileThree = this.teleport9Layer.getTileAt(playerTeleport3Tile.x, playerTeleport3Tile.y);
        if(tileThree && tileThree.index !== -1){
            this.sound.play("teleportAudio", {
                volume: .5,
                detune: 1200
            });
            my.sprite.player.x = 8*18;
            my.sprite.player.y = 11*18;
        }
        
        let playerDeathTile = this.deathLayer.worldToTileXY(my.sprite.player.x, my.sprite.player.y - my.sprite.player.height/2 +1);
        let tileDeath = this.deathLayer.getTileAt(playerDeathTile.x, playerDeathTile.y);
        if(tileDeath && tileDeath.index !== -1){
            this.myHealth = 100;
            this.scene.start("looserScene");
        }
        
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            this.vfx.hop.stop();
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpAudio", {
                volume: .5,
                detune: 1200
            });

            this.vfx.hop.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.hop.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                this.vfx.hop.start();
                this.myHealth-=3;
                my.text.health.setText(this.myHealth);
            }
        }

        //health
        my.text.health.x = my.sprite.player.x - 10;
        my.text.health.y = my.sprite.player.y - 30;

        if (this.myHealth <= 0){
            this.myHealth = 100;
            this.scene.start("looserScene");
        }
    }
}