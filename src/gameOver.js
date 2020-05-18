class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: "GameOver" });
	}

	preload() {
	       this.load.audio('gameOver', 'assets/audios/gameOver.wav');
           this.load.bitmapFont('fuente', 'assets/fuentes/font.png', 'assets/fuentes/font.fnt');
           this.load.image('perder', 'assets/imgs/gameOver.png');
	}

	create() {

        let contador = 0;
        let temp;
        let sonido = this.sound.add('gameOver');
				let imagen;

        self = this;
        centroX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        centroY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        textoInicio = this.add.bitmapText(centroX-90, centroY-20, 'fuente', 'GAME OVER', 25);
        imagen = this.add.image(textoInicio.x+95, textoInicio.y+70, 'perder');
        imagen.setScale(2.5);

        this.scene.remove('SceneA');

        this.cameras.main.fadeIn(1000);

        temp = setInterval(function(){
        	contador++;

            if(contador == 1){
                sonido.play();
            }

            if(contador == 4){
                self.cameras.main.fadeOut(2000);
            }

        	if(contador == 6){
                self.scene.add("SceneA", new SceneA);
    	        	self.scene.start('SceneA');
                sonido.pause();
                clearInterval(temp);
        	}
        }, 1000);

	}

	update(time, delta) {

	}
}
