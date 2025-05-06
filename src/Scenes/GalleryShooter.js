class GalleryShooter extends Phaser.Scene {
    constructor() {
        super('GalleryShooter');
    }

    preload() {
        this.load.image('background', 'assets/blue.png');
        this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml', { premultiplyAlpha: true });
        this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');
        this.load.audio('playerLaserSound', 'assets/sfx_laser1.ogg');
        this.load.audio('enemyLaserSound', 'assets/sfx_laser2.ogg');
        this.load.audio('playerHitZap', 'assets/sfx_shieldDown.ogg');
    }

    create() {
        // Add background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Textures
        this.textures.get('kenny').setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.textures.get('kenny2').setFilter(Phaser.Textures.FilterMode.LINEAR);

        // Audio
        this.playerLaserSound = this.sound.add('playerLaserSound');
        this.enemyLaserSound = this.sound.add('enemyLaserSound');
        this.playerHitZap = this.sound.add('playerHitZap');

        // Input
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
            restart: Phaser.Input.Keyboard.KeyCodes.R
        });

        // Initialize player, groups, and variables
        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'kenny2', 'playerShip1_red.png');
        this.player.setCollideWorldBounds(true);
        this.spears = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.enemyLasers = this.physics.add.group();

        this.score = 0;
        this.lives = 3;
        this.gameOver = false;

        // UI
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.livesText = this.add.text(20, 50, 'Lives: 3', { fontSize: '24px', fill: '#fff' });

        // Enemy spawner
        this.enemySpawnEvent = this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.physics.add.overlap(this.spears, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.enemyLasers, this.player, this.hitPlayer, null, this);
        this.physics.add.overlap(this.enemies, this.player, this.hitPlayerByEnemy, null, this);
    }

    spawnEnemy() {
        const type = Phaser.Math.Between(0, 1);
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const enemy = this.enemies.create(x, -50, 'kenny', type === 0 ? 'shipGreen_manned.png' : 'shipBlue_manned.png');
        enemy.setScale(0.7);
        enemy.setOrigin(0.5);
        enemy.setData('type', type);
        enemy.setData('lastShotTime', 0);

        if (type === 0) {
            enemy.setVelocityY(100);
        } else {
            const dx = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
            enemy.setVelocity(dx, 100);
            enemy.setBounce(1, 0);
            enemy.body.allowGravity = false;
            enemy.body.setCollideWorldBounds(true);
            enemy.body.onWorldBounds = true;
            enemy.body.checkCollision.up = false;
            enemy.body.checkCollision.down = false;
        }
    }

    hitEnemy(spear, enemy) {
        spear.destroy();
        enemy.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, laser) {
        laser.destroy();
        this.playerHitZap.play();
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);
        if (this.lives <= 0) this.endGame();
    }

    hitPlayerByEnemy(player, enemy) {
        if (enemy.getData('type') === 1) {
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
            enemy.destroy();
            if (this.lives <= 0) this.endGame();
        }
    }

    endGame() {
        this.gameOver = true;
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score);
        }

        this.gameOverText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            `Game Over\nHigh Score: ${localStorage.getItem('highScore')}\nPress R to Restart`,
            { fontSize: '32px', fill: '#fff', align: 'center' }
        ).setOrigin(0.5);
    }

    update(time) {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
                this.scene.start('TitleScreen');
            }
            return;
        }

        // Movement
        if (this.keys.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.keys.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Shoot
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            const spear = this.spears.create(this.player.x, this.player.y - 50, 'kenny2', 'laserBlue01.png');
            spear.setVelocityY(-400);
            this.playerLaserSound.play();
        }

        // Cleanup out-of-bounds lasers
        this.spears.children.each((spear) => {
            if (spear.y < 0) spear.destroy();
        });

        this.enemyLasers.children.each((laser) => {
            if (laser.y > this.game.config.height) laser.destroy();
        });

        // Enemy behavior
        this.enemies.children.each((enemy) => {
            if (!enemy) return;

            if (enemy.y > this.game.config.height || enemy.x < -50 || enemy.x > this.game.config.width + 50) {
                enemy.destroy();
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
                if (this.lives <= 0) this.endGame();
                return;
            }

            if (enemy.getData('type') === 0) {
                const lastShot = enemy.getData('lastShotTime');
                if (time - lastShot > 3500) {
                    const laser = this.enemyLasers.create(enemy.x, enemy.y + 20, 'kenny2', 'laserRed01.png');
                    laser.setVelocityY(200);
                    enemy.setData('lastShotTime', time);
                    this.enemyLaserSound.play();
                }
            }
        });

        this.enemyLasers.children.iterate((laser) => {
            if (laser && laser.y > this.game.config.height) laser.destroy();
        });
    }

    endGame() {
        this.gameOver = true;

        const highScore = localStorage.getItem('highScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score);
        }

        this.gameOverText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            `Game Over\nHigh Score: ${localStorage.getItem('highScore')}\nPress R to Restart`,
            { fontSize: '32px', fill: '#fff', align: 'center' }
        ).setOrigin(0.5);
    }
}