class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('bg', 'assets/starfield.gif');
        this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml');
        this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');
        this.load.audio('bgm', 'assets/Space.mp3');
    }

    create() {

        if (!this.sound.get('bgm')) {
            this.bgm = this.sound.add('bgm', { volume: 0.2, loop: true });
            this.bgm.play();
        }
        // Starfield
        this.starfield = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0);

        this.textures.get('kenny').setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.textures.get('kenny2').setFilter(Phaser.Textures.FilterMode.LINEAR);

        // Title
        this.add.text(400, 100, 'SPACE FIGHTER', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // High Score
        const highScore = localStorage.getItem('highScore') || 0;
        this.add.text(400, 160, `High Score: ${highScore}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Start Game Button
        const startText = this.add.text(400, 500, 'START GAME', {
            fontSize: '32px',
            fill: '#00ff00'
        }).setOrigin(0.5).setInteractive();

        startText.on('pointerdown', () => {
            this.scene.start('GalleryShooter'); // Start main game scene
        });

        // Endless Mode Button
        const endlessText = this.add.text(400, 550, 'ENDLESS MODE', {
            fontSize: '32px',
            fill: '#ff0000'
        }).setOrigin(0.5).setInteractive();

        endlessText.on('pointerdown', () => {
            this.scene.start('EndlessScene'); // Start Endless mode
        });

        // Controls Text
        this.add.text(400, 610, 'A/D to Move - SPACE to Shoot', {
            fontSize: '18px',
            fill: '#cccccc'
        }).setOrigin(0.5);

        // Animated Ships
        this.playerShips = this.add.group();
        this.enemyShips = this.add.group();

        for (let i = 0; i < 1; i++) {
            const px = -100 - i * 120;
            const player = this.add.sprite(px, 350, 'kenny2', 'playerShip1_red.png').setScale(0.7);
            player.rotation = Phaser.Math.DegToRad(90);
            const enemy = this.add.sprite(px - 250, 430, 'kenny', 'shipBlue_manned.png').setScale(0.7);
            const enemy2 = this.add.sprite(px - 250, 200, 'kenny', 'shipGreen_manned.png').setScale(0.7);
            this.playerShips.add(player);
            this.enemyShips.add(enemy);
            this.enemyShips.add(enemy2);
        }
    }

    update() {
        this.starfield.tilePositionX += 1;

        this.playerShips.children.iterate(ship => {
            ship.x += 1.5;
            if (ship.x > 900) ship.x = -100;
        });

        this.enemyShips.children.iterate(ship => {
            ship.x += 1.5;
            if (ship.x > 900) ship.x = -100; 
        });
    }
}
