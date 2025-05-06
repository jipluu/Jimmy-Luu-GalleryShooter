class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
    }

    preload() {
        this.load.image('titleBackground', 'assets/blue.png');
        this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml');
        this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');
    }

    create() {
        // Background

        this.textures.get('kenny').setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.textures.get('kenny2').setFilter(Phaser.Textures.FilterMode.LINEAR);

        this.add.image(0, 0, 'titleBackground')
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Title
        this.add.text(500, 200, 'Gallery Shooter', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // High Score
        const highScore = localStorage.getItem('highScore') || 0;
        this.add.text(400, 500, `High Score: ${highScore}`, { fontSize: '24px', fill: '#fff' });

        // Play Button
        const playText = this.add.text(500, 350, 'Play Game', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        playText.setInteractive();
        playText.on('pointerdown', () => {
            if (this.scene.isActive('GalleryShooter')) {
                this.scene.stop('GalleryShooter');
            }
            this.scene.start('GalleryShooter');
        });

        // Decorative Ships
        this.add.image(150, 100, 'kenny2', 'playerShip1_red.png').setScale(1.5).setAngle(-20);
        this.add.image(850, 200, 'kenny', 'shipBlue_manned.png').setScale(1.3).setAngle(20);
        this.add.image(200, 550, 'kenny2', 'playerShip3_green.png').setScale(1.2).setAngle(10);
        this.add.image(800, 550, 'kenny', 'shipGreen_manned.png').setScale(1.2).setAngle(-10);
    }
}


