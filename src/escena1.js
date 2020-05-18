class SceneA extends Phaser.Scene {
	constructor() {
		super({ key: "SceneA" });
	}

	preload() {
		this.load.image('fondo', 'assets/imgs/fondo.png');
		this.load.audio('start', 'assets/audios/principal.mp3');
		this.load.bitmapFont('fuente', 'assets/fuentes/font.png', 'assets/fuentes/font.fnt');
	}

	create() {
		let fondo = this.add.tileSprite(0, 0, 800, 600, 'fondo');
		let musica = this.sound.add('start');
		let temporizador;
		let contador = 0;
		let temporizadorTexto;
		let contadorTexto = 0;

		self = this;

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
					vidas = 3;
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
        //self.textures.removeKey('fuente');
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
