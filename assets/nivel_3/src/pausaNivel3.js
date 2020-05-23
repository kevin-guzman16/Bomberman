class pausaNivel_III extends Phaser.Scene {
	constructor() {
		super({ key: "pausaNivel_III" });
	}

	preload() {
		this.load.audio('pausa', 'bomberman/assets/audios/pausa.wav');
	}

	create() {
		let musica = this.sound.add('pausa');
		let texto = this.add.text(centroX, centroY, 'PAUSE', { fontSize: '30px', fontWeight: 'bold' });

		musica.play();
		this.game.config.resolution = 2;

		centroX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    centroY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		this.input.keyboard.on('keydown-P', function(pointer) {
			musica.play();
			this.scene.resume("Nivel_III");
			musica_fondo.resume();
			texto.destroy();
		}, this);


	}

	update() {

	}
}
