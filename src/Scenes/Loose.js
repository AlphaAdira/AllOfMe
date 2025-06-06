class Loose extends Phaser.Scene {
    constructor() {
        super("looserScene");
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        }
    create() {
        my.text.end = this.add.text(400, 100, "Game Over", {
           fontFamily: 'Times, serif',
           fontSize: 200,
           wordWrap: {
               width: 1800
           }
        });
        my.text.score = this.add.text(750, 350, "Score:   " + score, {
           fontFamily: 'Times, serif',
           fontSize: 100,
           wordWrap: {
               width: 300
           }
        });
        my.text.restart = this.add.text(650, 600, "[Space] to Play Again", {
           fontFamily: 'Times, serif',
           fontSize: 50,
           wordWrap: {
               width: 1800
           }
        });
        
        this.again = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.sound.play("outcome", {
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