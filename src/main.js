// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// BuildAMonster
//
// A template for building a monster using a series of assets from
// a sprite atlas.
// 
// Art assets from Kenny Assets "Monster Builder Pack" set:
// https://kenney.nl/assets/monster-builder-pack

"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: { pixelArt: true },
    width: 1000,
    height: 800,
    fps: {
        forceSetTimeOut: true,
        target: 30
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [TitleScreen, GalleryShooter]  // Ensure both scenes are included here
};

var my = { sprite: {} };
const game = new Phaser.Game(config);


