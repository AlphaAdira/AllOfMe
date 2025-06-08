class Open extends Phaser.Scene {
    constructor() {
        super("openScene");
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {
        my.text.end = this.add.text(250, 200, "All of Me", {
           fontFamily: 'Times, serif',
           fontSize: 300,
           wordWrap: {
               width: 1800
           }
        });
        my.text.restart = this.add.text(650, 600, "[Space] to Play", {
           fontFamily: 'Times, serif',
           fontSize: 50,
           wordWrap: {
               width: 1800
           }
        });
        
        this.again = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.sound.play("outcomeW", {
            volume: 1   // Can adjust volume using this, goes from 0 to 1
        });
    }

    update() {
        // Start Over
        if (this.again.isDown) {
            score = 0;
            this.scene.start("tutorialScene");
        }
    }
}