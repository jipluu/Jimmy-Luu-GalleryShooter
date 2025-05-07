// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// BuildAMonster
//
// A template for building a monster using a series of assets from
// a sprite atlas.

"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    render: { pixelArt: true },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    fps: { target: 60 },
    scene: [
        CreditsScene,
        TitleScreen,
        GalleryShooter,
        BossScene,
        WinScene,
        GameOverScene,
        MainMenu,
        EndlessScene
    ]
};

let my = { sprite: {}, text: {} };
let highScore = localStorage.getItem("highScore") || 0;

const game = new Phaser.Game(config);



