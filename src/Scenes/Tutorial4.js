class Tutorial4 extends Phaser.Scene {
    constructor() {
        super("tutorial4Scene");
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
        this.map = this.add.tilemap("platformer-level-4", 18, 18, 100, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("normal_tilemap_packed", "tilemap_tiles_2");

        // Create a layer
        this.backLayer = this.map.createLayer("backgrounds 1", this.tileset, 0, 0);
        this.airLayer = this.map.createLayer("air", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wall", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("platformT", this.tileset, 0, 0);
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
        
        this.backLayer.setCollisionByProperty({
            swim: true
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
            frame: ['circle_03.png'],
            scale: {start: 0.01, end: 0.05},
            lifespan: 500,
            maxParticles: 50,
            alpha: {start: .5, end: 0.1}, 
        });
        this.vfx.walking.stop();

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(500, 50, "platformer_characters", "tile_0000.png")
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.end = this.add.sprite(343, 155, "end4");
        my.sprite.end.visible = false;
        
        my.sprite.bubble = this.add.sprite(603.2, 97, "kenny-particles", "circle_05.png");
        my.sprite.bubble.setScale(.2);
        my.sprite.npc = this.add.sprite(603, 97, "platformer_characters", "tile_0024.png");
        my.sprite.npc.setFlip(false, true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.groundLayer2);

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

        this.next = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.skip = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        my.text.help = this.add.text(my.sprite.player.x - 200, 100, "Congratulations!\nYou got past the level b̸̝͊a̵̙͆͝s̴͕̉ä̴̮̤ľ̴͎i̴̺͎͗͠s̴̳̐̽k̶͇̣͆!", {
            font: 'bold 20px "Comic Sans MS", sans-serif',
            fill: 'black',
            stroke: '#ffffff', // Outline color (black)
            strokeThickness: 2, // Thickness of the outline
            wordWrap: {
                width: 1800
            }
        });
        my.text.spaceNext = this.add.text(my.sprite.player.x - 200, 73, "[Space] to go to next rule // [X] to skip the tutorial", {
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

        //health
        my.text.health.x = my.sprite.player.x - 10;
        my.text.health.y = my.sprite.player.y - 30;

        if (this.myHealth <= 0){
            this.myHealth = 100;
            this.scene.start("tutorialScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.skip)) {
            this.scene.start("platformer4Scene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.next)) {
            my.sprite.player.x = 500;
            my.text.help.x = my.sprite.player.x - 200;
            my.text.spaceNext.x = my.sprite.player.x - 200;
            if (this.index == 0){
                my.text.help.setText("With another level now completed\nYou are now completely stable!");
                this.index++;
            } else if (this.index == 1){
                my.text.help.setText("This area does seem to be completely flooded\nLuckily your stability means you can swim now");
                this.index++;
                console.log(this.index);
            } else if (this.index == 2){
                my.text.help.setText("Since you don't need an energy bar anymore\nI will replace it with an Oxygen bar");
                this.index++;
                console.log(this.index);
            } else if (this.index == 3){
                my.text.help.setText("You won't be able to breath forever\nSwim up to the surface to breath");
                this.index++;
                console.log(this.index);
            } else if (this.index == 4){
                my.text.help.setText("New world also means new end goal\nThe end of this level looks like this\n >>      <<");
                my.sprite.end.visible = true;
                this.index++;
                console.log(this.index);
            } else if (this.index == 5){
                my.text.help.setText("Good Luck!");
                my.sprite.end.visible = false;
                this.index++;
                console.log(this.index);
            } else {
                this.scene.start("platformer4Scene");
            }
        }
    }
}
