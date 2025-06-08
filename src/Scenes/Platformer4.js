class Platformer4 extends Phaser.Scene {
    constructor() {
        super("platformer4Scene");
        this.doubleJump = true;
        this.myHealth = 100;
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 100;    // DRAG < ACCELERATION = icy slide
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
        this.map = this.add.tilemap("platformer-level-4", 18, 18, 100, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("normal_tilemap_packed", "tilemap_tiles_2");

        // Create a layer
        this.backLayer = this.map.createLayer("backgrounds 1", this.tileset, 0, 0);
        this.airLayer = this.map.createLayer("air", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wall", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platforms", this.tileset, 0, 0);
        this.groundLayer2 = this.map.createLayer("backgrounds 2", this.tileset, 0, 0);

        // Make it collidable - platforms
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundLayer2.setCollisionByProperty({
            collides: true
        });
        
        this.airLayer.setCollisionByProperty({
            breath: true
        });
        
        this.wallLayer.setCollisionByProperty({
            collides: true
        });
        
        this.backLayer.setCollisionByProperty({
            swim: true
        });

        this.done = this.map.createFromObjects("end", {
            name: "treasure",
            key: "tilemap_sheet_2",
            frame: 67
        });

        // TODO: Add turn into Arcade Physics here
        this.physics.world.enable(this.done, Phaser.Physics.Arcade.STATIC_BODY);
        this.theend = this.add.group(this.done);
        
        this.walkSound = this.sound.add("swimAudio", {
            volume: 1,
            detune: 1200
        });
        this.wait = this.sound.add("swimAudio", {
            volume: 0
        });

        ////////////////////
        // Particles!!!
        ////////////////////
        this.vfx = {};

        this.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_03.png'],
            scale: {start: 0.01, end: 0.05},
            lifespan: 500,
            maxParticles: 50,
            alpha: {start: .5, end: 0.1}, 
        });
        this.vfx.walking.stop();

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(10*18, 40*18, "platformer_characters", "tile_0000.png")
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.groundLayer2);
        this.physics.add.collider(my.sprite.player, this.wallLayer);

        this.physics.add.overlap(my.sprite.player, this.theend, (obj1, obj2) => {
            score += this.myHealth;
            this.myHealth = 100;
            this.scene.start("winnerScene");
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
            fill: 'blue',
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
        my.sprite.player.body.allowGravity = false;

        if(cursors.left.isDown) {
            if (my.sprite.player.body.velocity.x > -300){
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityX(-300);
            }
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if (!this.walkSound.isPlaying){
                this.walkSound.play();
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.vfx.walking.start();
            
        } else if(cursors.right.isDown) {
            if (my.sprite.player.body.velocity.x < 300){
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityX(300);
            }
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if (!this.walkSound.isPlaying){
                this.walkSound.play();
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.vfx.walking.start();
            
        } else if(cursors.up.isDown) {
            if (my.sprite.player.body.velocity.y > -300){
                my.sprite.player.body.setAccelerationY(-this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityY(-300);
            }
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if (!this.walkSound.isPlaying){
                this.walkSound.play();
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.vfx.walking.start();

        } else if(cursors.down.isDown) {
            if (my.sprite.player.body.velocity.y < 300){
                my.sprite.player.body.setAccelerationY(this.ACCELERATION);
            } else {
                my.sprite.player.body.setVelocityY(300);
            }
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if (!this.walkSound.isPlaying){
                this.walkSound.play();
            }
            
            this.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.vfx.walking.start();

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setAccelerationY(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.body.setDragY(this.DRAG);
            my.sprite.player.anims.play('idle');
            this.vfx.walking.stop();
            this.walkSound.pause();
        }
        
        let playerDeathTile = this.backLayer.worldToTileXY(my.sprite.player.x, my.sprite.player.y - my.sprite.player.height/2 +1);
        let tileDeath = this.backLayer.getTileAt(playerDeathTile.x, playerDeathTile.y);
        if(tileDeath && tileDeath.index !== -1){
            if (!this.wait.isPlaying){
                this.wait.play();
                this.myHealth-=1;
                my.text.health.setText(this.myHealth);
            }
        }
        
        let playerTeleport3Tile = this.airLayer.worldToTileXY(my.sprite.player.x, my.sprite.player.y);
        let tileThree = this.airLayer.getTileAt(playerTeleport3Tile.x, playerTeleport3Tile.y);
        if(tileThree && tileThree.index !== -1){
            if (!this.wait.isPlaying){
                this.wait.play();
                if (this.myHealth < 100){
                    this.myHealth+=2;
                    if (this.myHealth > 100){
                        this.myHealth = 100;
                    }
                    my.text.health.setText(this.myHealth);
                }
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