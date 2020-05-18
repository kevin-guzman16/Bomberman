class Victoria extends Phaser.Scene {
	constructor() {
		super({ key: "Victoria" });
	}

	preload() {
	       this.load.audio('victoria', 'assets/audios/victoria.mp3');
         this.load.bitmapFont('fuente', 'assets/fuentes/font.png', 'assets/fuentes/font.fnt');
         this.load.image('victoria', 'assets/imgs/victoria.png');
	}

	create() {

        let contador = 0;
        let temp;
        let temporizador;
        let sonido = this.sound.add('victoria');
        let textoScore;
        this.textoVolver = undefined;
        let imagen;
        let puntuacion = score.toString().padStart(4,'0');
        let contador2 = 0;

        self = this;
        contador = 0;
        centroX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        centroY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        textoInicio = this.add.bitmapText(centroX-120, 150, 'fuente', 'VICTORIA', 30);
        imagen = this.add.image(textoInicio.x+120, textoInicio.y+150, 'victoria');
        imagen.setScale(1.5);

        this.scene.remove('Nivel_III');
        this.scene.remove('PNivel3');
        this.scene.remove('SceneA');

        this.cameras.main.fadeIn(1000);

        temp = setInterval(function(){
        	contador++;

            if(contador == 1){
                sonido.play();
            }

            if(contador == 7){
                sonido.pause();
                textoScore = self.add.bitmapText(imagen.x-130, imagen.y+imagen.width+15, 'fuente', "PUNTUACION: "+puntuacion, 18);
                //self.cameras.main.fadeOut(2000);
            }

        	  if(contador == 9){
                contador2++
                self.textoVolver = self.add.bitmapText(textoScore.x-130, textoScore.y+25, 'fuente', "PRESIONA Z PARA VOLVER AL MENU PRINCIPAL", 15);
                self.input.keyboard.on('keydown-'+'Z', function() {

            			self.cameras.main.fadeOut(1000);

            			temporizador = setInterval(function(){
            				contador++;

            				if(contador2 == 1){
            					self.limpiarCache();
            					self.scene.add("SceneA", new SceneA);
            					self.scene.start("SceneA");
                      clearInterval(temporizador);
            					clearInterval(temp);
            				}

            			},1000);
            		}, this);
        	}
        }, 1000);

	}

  limpiarCache(){
    self.textures.removeKey('victoria');
  }

	update(time, delta) {

	}
}
