class PNivel3 extends Phaser.Scene {
	constructor() {
		super({ key: "PNivel3" });
	}

	preload() {
	       this.load.audio('inicio', 'assets/audios/inicioNivel.wav');
               this.load.bitmapFont('fuente', 'assets/fuentes/font.png', 'assets/fuentes/font.fnt');
	}

	create() {
	
        let contador = 0;
        let temp;
        let sonido = this.sound.add('inicio');

        self = this;
        centroX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        centroY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        textoInicio = this.add.bitmapText(0, centroY,'fuente', 'NIVEL 3', 18);

        this.scene.remove('Nivel_III');
        this.cameras.main.fadeIn(1000);

        if(haReiniciado){
            score -= 70;
            if(score < 0){
                score = 0;
            }
        }


        temp = setInterval(function(){
        	contador++;

                if(contador == 1){
                        sonido.play();
                }        

                if(contador == 2){
                        self.cameras.main.fadeOut(1000);
                }

        	if(contador == 3){
                       self.scene.add("Nivel_III", new Nivel_III);
        	       self.scene.start('Nivel_III');
                       sonido.pause();
                       clearInterval(temp);
        	}
        }, 1000);

	}

	update(time, delta) {
                if(textoInicio.x != (centroX-40)){
                        textoInicio.x += 8; 
                }
	}
}