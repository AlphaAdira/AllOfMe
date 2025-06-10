class Tutorial2 extends Phaser.Scene {
    constructor() {
        super("tutorial2Scene");
        this.myHealth = 100;
        this.index = 0;
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
        this.index = 0;
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 100 tiles wide and 50 tiles tall.
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 100, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("normal_tilemap_packed", "tilemap_tiles_2");

        // Create a layer
        this.wallLayer = this.map.createLayer("walls", this.tileset, 0, 0);
        this.deathLayer = this.map.createLayer("water", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platformT", this.tileset, 0, 0);

        // Make it collidable - platforms
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

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

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(500, 670, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.token = this.add.sprite(343, 635, "token2");
        my.sprite.token.visible = false;
        my.sprite.end = this.add.sprite(343, 635, "end2");
        my.sprite.end.visible = false;
        my.sprite.t1 = this.add.sprite(323, 635, "t1");
        my.sprite.t1.visible = false;
        my.sprite.t2 = this.add.sprite(343, 635, "t2");
        my.sprite.t2.visible = false;
        my.sprite.t3 = this.add.sprite(363, 635, "t3");
        my.sprite.t3.visible = false;
        my.sprite.tp1 = this.add.sprite(323, 635, "tp1");
        my.sprite.tp1.visible = false;
        my.sprite.tp2 = this.add.sprite(343, 635, "tp2");
        my.sprite.tp2.visible = false;
        my.sprite.tp3 = this.add.sprite(363, 635, "tp3");
        my.sprite.tp3.visible = false;
        
        my.sprite.npc = this.add.sprite(320, 660, "platformer_characters", "tile_0025.png");
        my.sprite.npc.setFlip(true, false);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, 1800, 900);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(0, 0);
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

        this.next = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.skip = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        my.text.help = this.add.text(my.sprite.player.x - 200, 580, "Congratulations!\nYou got past the level s̵̡̯̑͐t̴͙̾r̸̨̼̃̀a̸̲͒͗y̴͈̚!", {
            font: 'bold 20px "Comic Sans MS", sans-serif',
            fill: 'black',
            stroke: '#ffffff', // Outline color (black)
            strokeThickness: 2, // Thickness of the outline
            wordWrap: {
                width: 1800
            }
        });
        my.text.spaceNext = this.add.text(my.sprite.player.x - 200, 695, "[Space] to go to next rule // [X] to skip the tutorial", {
            font: 'bold 10px "Comic Sans MS", sans-serif',
            fill: 'black',
            stroke: '#ffffff', // Outline color (black)
            strokeThickness: 2, // Thickness of the outline
            wordWrap: {
                width: 1800
            }
        });

        this.animatedTiles.init(this.map);

        this.sound.play("nextSceneAudio", {
            volume: 1   // Can adjust volume using this, goes from 0 to 1
        });
    }

    update() {
        my.sprite.npc.anims.play('fly', true);
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
        
        let onLadder = false;
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!onLadder){
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
                    this.myHealth-=5;
                    my.text.health.setText(this.myHealth);
                }
            }
        }

        //health
        my.text.health.x = my.sprite.player.x - 10;
        my.text.health.y = my.sprite.player.y - 30;

        if (this.myHealth <= 0){
            this.myHealth = 100;
            this.scene.start("tutorial2Scene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.skip)) {
            this.scene.start("platformer2Scene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.next)) {
            my.sprite.player.x = 500;
            my.text.help.x = my.sprite.player.x - 200;
            my.text.spaceNext.x = my.sprite.player.x - 200;
            if (this.index == 0){
                my.text.help.setText("With one level complete\nYour energy will drain slightly slower!");
                this.index++;
            } else if (this.index == 1){
                my.text.help.setText("With a new area, you'll have new tokens\nToken this level look like this\n >>      <<");
                my.sprite.token.visible = true;
                this.index++;
                console.log(this.index);
            } else if (this.index == 2){
                my.sprite.token.visible = false;
                my.text.help.setText("Careful not to fall into the water!\nYou aren't stable enough to swim yet");
                this.index++;
                console.log(this.index);
            } else if (this.index == 3){
                my.sprite.token.visible = false;
                my.text.help.setText("This level seems to have some interesting blocks\nThese blocks will send you around the map");
                this.index++;
                my.sprite.t1.visible = true;
                my.sprite.t2.visible = true;
                my.sprite.t3.visible = true;
                console.log(this.index);
            } else if (this.index == 4){
                my.sprite.t1.visible = false;
                my.sprite.t2.visible = false;
                my.sprite.t3.visible = false;
                my.text.help.setText("They will send you the a corresponding location\nThese locations are marked with these blocks");
                this.index++;
                my.sprite.tp1.visible = true;
                my.sprite.tp2.visible = true;
                my.sprite.tp3.visible = true;
                console.log(this.index);
            } else if (this.index == 5){
                my.sprite.tp1.visible = false;
                my.sprite.tp2.visible = false;
                my.sprite.tp3.visible = false;
                my.text.help.setText("New world also means new end goal\nThe end of this level looks like this\n >>      <<");
                my.sprite.end.visible = true;
                this.index++;
                console.log(this.index);
            } else if (this.index == 6){
                my.text.help.setText("Good Luck!");
                my.sprite.end.visible = false;
                this.index++;
                console.log(this.index);
            } else {
                this.scene.start("platformer2Scene");
            }
        }
    }
}
