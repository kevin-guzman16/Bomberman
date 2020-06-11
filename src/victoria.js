class Victoria extends Phaser.Scene {
	constructor() {
		super({ key: "Victoria" });
	}

	preload() {
	       this.load.audio('victoria', 'bomberman/assets/audios/victoria.mp3');
         this.load.bitmapFont('fuente', 'bomberman/assets/fuentes/font.png', 'assets/fuentes/font.fnt');
         this.load.image('victoria', 'bomberman/assets/imgs/victoria.png');
	}

	create() {

        let contador = 0;
        let temp;
        let temporizador;
        let sonido = this.sound.add('victoria');
        let textoScore;
        let imagen;
        let puntuacion = score.toString().padStart(4,'0');

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
            }

        	  if(contador == 8){
								self.limpiarCache();
              	clearInterval(temp);
								setTimeout(self.sendScoreAJAX, 2000);
        		}
        }, 1000);

	}

  limpiarCache(){
    self.textures.removeKey('victoria');
  }

}
