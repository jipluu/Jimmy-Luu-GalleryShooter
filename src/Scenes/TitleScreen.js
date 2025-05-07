class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
    }

    preload() {
        this.load.image('bg', 'assets/starfield.gif');
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);
        this.add.text(400, 300, 'GALLERY SHOOTER\nClick to Start', {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this.input.once('pointerdown', () => this.scene.start('GalleryShooter'));
        this.input.keyboard.on('keydown-C', () => this.scene.start('ControlsScene'));
        this.input.keyboard.on('keydown-R', () => this.scene.start('CreditsScene'));
    }

    update() {
        this.starfield.tilePositionY -= 1;
    }
}


