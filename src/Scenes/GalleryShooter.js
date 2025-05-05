class GalleryShooter extends Phaser.Scene {
    constructor() {
        super('GalleryShooter');
    }

    preload() {
        this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml');
        this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');
    }

    create() {
        this.initGame();

        // Controls
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
            restart: Phaser.Input.Keyboard.KeyCodes.R
        });

        // Score/Health text
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.livesText = this.add.text(20, 50, 'Lives: 3', { fontSize: '24px', fill: '#fff' });

        // Spawn enemies periodically
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const x = Phaser.Math.Between(50, this.game.config.width - 50);
                const enemy = this.enemies.create(x, -50, 'kenny', 'shipGreen_manned.png');
                enemy.setVelocityY(100);
            },
            loop: true
        });

        // Collision detection
        this.physics.add.overlap(this.spears, this.enemies, this.hitEnemy, null, this);
    }

    initGame() {
        // Reset player, score, lives
        if (this.player) this.player.destroy();
        if (this.spears) this.spears.clear(true, true);
        if (this.enemies) this.enemies.clear(true, true);

        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'kenny2', 'playerShip1_red.png');
        this.player.setCollideWorldBounds(true);

        this.spears = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
    }

    hitEnemy(spear, enemy) {
        spear.destroy();
        enemy.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
    }

    update() {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
                this.scene.restart();
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

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            const spear = this.spears.create(this.player.x, this.player.y - 50, 'kenny2', 'laserBlue01.png');
            spear.setVelocityY(-400);
        }

        // Clean up offscreen spears
        this.spears.children.iterate((spear) => {
            if (spear && spear.y < 0) spear.destroy();
        });

        // Check enemies going offscreen (hurts player)
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.y > this.game.config.height) {
                enemy.destroy();
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
                if (this.lives <= 0) this.endGame();
            }
        });
    }

    endGame() {
        this.gameOver = true;
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Game Over\nPress R to Restart', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
    }
}
