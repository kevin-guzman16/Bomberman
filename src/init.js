


    class SceneA extends Phaser.Scene {
    constructor() {
        super({ key: "SceneA" });
    }

    preload() {
        this.load.image('fondo', 'bomberman/assets/imgs/fondo.png');
        this.load.audio('start', 'bomberman/assets/audios/principal.mp3');
        this.load.bitmapFont('fuente', 'bomberman/assets/fuentes/font.png', 'bomberman/assets/fuentes/font.fnt');

        if(!scriptsCargados){

            this.load.script('pausa1' ,'bomberman/assets/nivel_1/src/pausaNivel1.js');
            this.load.script('pnivel1', 'bomberman/assets/nivel_1/src/PNivel1.js');
            this.load.script('nivel1', 'bomberman/assets/nivel_1/src/nivel1.js');

            this.load.script('pausa2' ,'bomberman/assets/nivel_2/src/pausaNivel2.js');
            this.load.script('pnivel2', 'bomberman/assets/nivel_2/src/PNivel2.js');
            this.load.script('nivel2', 'bomberman/assets/nivel_2/src/nivel2.js');

            this.load.script('pausa3' ,'bomberman/assets/nivel_3/src/pausaNivel3.js');
            this.load.script('pnivel3', 'bomberman/assets/nivel_3/src/PNivel3.js');
            this.load.script('nivel3', 'bomberman/assets/nivel_3/src/nivel3.js');

            this.load.script('gameover', 'bomberman/src/gameOver.js');
            this.load.script('victoria', 'bomberman/src/victoria.js');
        }
    }

    create() {
        let fondo = this.add.tileSprite(0, 0, 800, 600, 'fondo');
        let musica = this.sound.add('start');
        let temporizador;
        let contador = 0;
        let temporizadorTexto;
        let contadorTexto = 0;

        self = this;
        scriptsCargados = true;

        console.log(this.load.isReady());

        this.scene.remove('GameOver');
        this.scene.remove('PNivel1');
        this.scene.remove('PNivel2');
        this.scene.remove('PNivel3');
        this.scene.remove('Nivel_I');
        this.scene.remove('Nivel_II');
        this.scene.remove('Nivel_III');

        musica.setLoop(true)
        musica.pauseOnBlur = false;
        musica.play();

        fondo.setOrigin(0, 0);

        this.cameras.main.fadeIn(1000);

        centroX = this.cameras.main.worldView.x + this.cameras.main.width / 4;
        centroY = this.cameras.main.worldView.y + this.cameras.main.height / 1.5;
        textoInicio = this.add.bitmapText(centroX, centroY,'fuente', 'PRESIONA ENTER PARA JUGAR', 18);

        temporizadorTexto = setInterval(function(){
            contadorTexto++
            textoInicio.alpha = 0;
            if(contadorTexto % 2 == 0){
                textoInicio.alpha = 1;
            } else {
                textoInicio.alpha = 0;
            }
        },500);



        this.input.keyboard.on('keydown-ENTER', function() {

            self.cameras.main.fadeOut(2000);

            temporizador = setInterval(function(){
                contador++;

                if(contador == 0){
                    musica.volume = 0.8;
                }

                if(contador == 1){
                    musica.volume = 0.5;
                }

                if(contador == 2){
                    musica.volume = 0;
                }

                if(contador == 3){
                    vidas = vidasContador;
                    score = 0;
                    musica.pause();
                    self.limpiarCache();
                    self.scene.add("PNivel1", new PNivel1);
                    self.scene.start("PNivel1");
                    clearInterval(temporizador);
                    clearInterval(temporizadorTexto);
                }

            },1000);
        }, this);


    }

     limpiarCache(){
        self.game.cache.tilemap.remove('mapa');
        self.game.cache.audio.remove('ganarSound');
        self.game.cache.audio.remove('start');
        self.game.cache.audio.remove('fondo');
        self.textures.removeKey('enemigos');
        self.textures.removeKey('puerta');
        self.textures.removeKey('bloqueRoto');
        self.textures.removeKey('tiles');
        self.textures.removeKey('fondo');
        self.anims.remove('enemigoCaminaIzquierda');
        self.anims.remove('enemigoCaminaDerecha');
        self.anims.remove('enemigoKill');
        self.anims.remove('explotaBloque');
        self.anims.remove('abrirPuerta');
        self.anims.remove('setBomba');
    }

    update(time, delta) {

    }
}


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
    let scriptsCargados = false;

    let puntuacion = 0;
    let self;

    let vidasContador = 2;
    let vidas = vidasContador;
    let score = 0;
    let haReiniciado;
    let textoInicio;

    let tiempoBomba = 2;
    let contador = 0;

    let game = new Phaser.Game(config);
