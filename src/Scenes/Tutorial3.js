class Tutorial3 extends Phaser.Scene {
    constructor() {
        super("tutorial3Scene");
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
        this.map = this.add.tilemap("platformer-level-3", 18, 18, 100, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("farm_tilemap_packed", "tilemap_tiles_3");

        // Create a layer
        this.wallLayer = this.map.createLayer("walls", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platformT", this.tileset, 0, 0);
        this.deathLayer2 = this.map.createLayer("glass", this.tileset, 0, 0);

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
        my.sprite.player = this.physics.add.sprite(500, 760, "platformer_characters", "tile_0000.png")
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.token = this.add.sprite(343, 715, "token3");
        my.sprite.token.visible = false;
        my.sprite.end = this.add.sprite(343, 715, "end3");
        my.sprite.end.visible = false;
        
        my.sprite.npc = this.add.sprite(320, 740, "platformer_characters", "tile_0025.png");
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
        my.text.help = this.add.text(my.sprite.player.x - 200, 660, "Congratulations s̶̗̬͝u̶̕n̶͉̫͆̕s̵͌̉ͅh̴̦͎̊̏i̶̟͌n̸̨͎͊͛e̶͖̰͠͝!\nYou made it to the next level!", {
            font: 'bold 20px "Comic Sans MS", sans-serif',
            fill: 'black',
            stroke: '#ffffff', // Outline color (black)
            strokeThickness: 2, // Thickness of the outline
            wordWrap: {
                width: 1800
            }
        });
        my.text.spaceNext = this.add.text(my.sprite.player.x - 200, 780, "[Space] to go to next rule // [X] to skip the tutorial", {
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
                    this.myHealth-=1;
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
                    this.myHealth-=1;
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
        
        
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            this.vfx.hop.stop();
            console.log(this.doubleJump);
            if (this.doubleJump && Phaser.Input.Keyboard.JustDown(cursors.up)){
                this.doubleJump = false;
                console.log(this.doubleJump);
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jumpAudio", {
                    volume: .5,
                    detune: 1200
                });
            }
        } else {
            this.doubleJump = true;
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
                this.myHealth-=2;
                my.text.health.setText(this.myHealth);
            }
        }

        //health
        my.text.health.x = my.sprite.player.x - 10;
        my.text.health.y = my.sprite.player.y - 30;

        if (this.myHealth <= 0){
            this.myHealth = 100;
            this.scene.start("tutorial3Scene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.skip)) {
            this.scene.start("platformer3Scene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.next)) {
            my.sprite.player.x = 500;
            my.text.help.x = my.sprite.player.x - 200;
            my.text.spaceNext.x = my.sprite.player.x - 200;
            if (this.index == 0){
                my.text.help.setText("With another level now completed\nYour energy will drain even slower!");
                this.index++;
            } else if (this.index == 1){
                my.text.help.setText("And new area means new tokens\nToken this level look like this\n >>      <<");
                my.sprite.token.visible = true;
                this.index++;
                console.log(this.index);
            } else if (this.index == 2){
                my.sprite.token.visible = false;
                my.text.help.setText("You are also stable enough to double jump!\n Jump midair to double jump");
                this.index++;
                console.log(this.index);
            } else if (this.index == 3){
                my.sprite.token.visible = false;
                my.text.help.setText("There are pits of deadly flowers coming\n Careful not to jump into them");
                this.index++;
                console.log(this.index);
            } else if (this.index == 4){
                my.sprite.token.visible = false;
                my.text.help.setText("There are also some tall trees ahead\n You might be able to jump onto them");
                this.index++;
                console.log(this.index);
            } else if (this.index == 5){
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
                this.scene.start("platformer3Scene");
            }
        }
    }
}