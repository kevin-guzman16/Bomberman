let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'juego',
        pixelArt: true,
        scale: {
            mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [SceneA]
    };

    let centroX;
    let centroY;

    let player;
    let bomba;

    let musica_fondo;
    let tiempoDeJuego = 200;

    let puntuacion = 0;
    let self;

    let vidas = 3;
    let score = 0;
    let haReiniciado;
    let textoInicio;

    let tiempoBomba = 2;
    let contador = 0;

    let game = new Phaser.Game(config);
