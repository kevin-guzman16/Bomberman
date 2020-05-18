class Nivel_I extends Phaser.Scene {

    constructor() {
        super({ key: "Nivel_I"});
    }


    preload ()
    {
        this.load.spritesheet('bomberman', 'assets/imgs/bomber.gif', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('perder', 'assets//imgs/perder_anim.png', { frameWidth: 17, frameHeight: 26 });
        this.load.spritesheet('enemigos', 'assets/nivel_1/imgs/enemigoII.png', { frameWidth: 22, frameHeight: 35});
        this.load.spritesheet('bomba', 'assets/nivel_1/imgs/bomba.png', { frameWidth: 20.5, frameHeight: 20.8 });
        this.load.spritesheet('explosion', 'assets/imgs/explosion.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('bloqueRoto', 'assets/nivel_1/imgs/bloque_anim_I.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('puerta', 'assets/nivel_1/imgs/puerta.png', { frameWidth: 24, frameHeight: 30 });

        this.load.audio('fondo', ['assets/nivel_1/audios/fondo_1.mp3']);

        this.load.tilemapTiledJSON('mapa', 'assets/nivel_1/mapa.json');

        this.load.image('tiles', 'assets/nivel_1/imgs/tileset_2.png');
        this.load.image('bloques', 'assets/nivel_1/imgs/bloque.png');
        this.load.image('marcador', 'assets/imgs/marcador.png');

        this.load.audio('explosionSound', ['assets/nivel_1/audios/explosion.wav']);
        this.load.audio('ponerBombaSound', ['assets/nivel_1/audios/ponerBomba.wav']);
        this.load.audio('ganarSound', ['assets/nivel_1/audios/ganar.mp3']);

        this.load.bitmapFont('fuente', 'assets/fuentes/font.png', 'assets/fuentes/font.fnt');


    }

    create ()
    {
        musica_fondo = this.sound.add('fondo');
        self=this;
        haReiniciado = false;

        this.ganarSound = this.sound.add('ganarSound');
        this.mapa = this.make.tilemap({ key: 'mapa' });
        this.quitarVida = false;
        this.tiempoJuego = tiempoDeJuego;
        this.game.config.resolution = 2;
        this.ponerBomba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.colliders = [];
        this.enemigos = this.physics.add.group();
        this.bloquesRompibles = this.physics.add.group();
        this.bloquesSolidos = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.puertaAbierta = false;
        this.pasarNivel = false;

        this.cameras.main.fadeIn(1000);

        let tilesets = this.mapa.addTilesetImage('tileset_2', 'tiles');
        let solidosArray = this.mapa.getObjectLayer('bloquesSolidos')['objects'];
        let rompiblesArray = this.mapa.getObjectLayer('bloquesRompibles')['objects'];
        let enemigosGroup = this.mapa.getObjectLayer('enemigos')['objects'];
        let posicionJugador = this.mapa.getObjectLayer('jugador')['objects'];
        let puerta = this.mapa.getObjectLayer('puerta')['objects'];
        let empezarX = posicionJugador[0].x+7;
        let empezarY = posicionJugador[0].y;

        musica_fondo.setLoop(true);
        musica_fondo.volume = 0.6;
        musica_fondo.play();

        this.mapa.createDynamicLayer('terreno', tilesets, 0, 0);

        solidosArray.forEach(obj => {
            const bloque = this.bloquesSolidos.create(obj.x, obj.y, 'bloques').setOrigin(0, 0);
            bloque.alpha = 0;
        });

        this.puerta = this.physics.add.sprite(puerta[0].x+8, puerta[0].y, 'puerta');
        this.puerta.setImmovable(true);
        this.children.bringToTop(this.puerta);

        player = this.physics.add.sprite(empezarX, empezarY, 'bomberman');
        player.setSize(13, 13, true);
        player.body.offset.y=13;


        this.anims.create({
            key: 'abrirPuerta',
            frames: this.anims.generateFrameNumbers('puerta', { start: 0, end: 2}),
            frameRate: 3
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('bomberman', { start: 21, end: 27 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'bomberman', frame: 14 } ],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('bomberman', { start: 7, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('bomberman', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('bomberman', { start: 14, end: 20 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'setBomba',
            frames: this.anims.generateFrameNumbers('bomba', { start:37 , end:39 }),
            frameRate: 4,
            repeat: -1

        });

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion', { start:0 , end:6 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'boomAlcance',
            frames: this.anims.generateFrameNumbers('explosion', { start:7, end:13 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'boomFinal',
            frames: this.anims.generateFrameNumbers('explosion', { start: 14, end: 20 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'tocarExplosion',
            frames: this.anims.generateFrameNumbers('perder', { start: 0, end: 3 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'explotaBloque',
            frames: this.anims.generateFrameNumbers('bloqueRoto', {start:0, end: 6}),
            frameRate: 6,
        })

        this.anims.create({
            key: 'bloqueEstatico',
            frames: [ { key: 'bloqueRoto', frame: 0 } ]
        })

        this.anims.create({
            key: 'enemigoCaminaIzquierda',
            frames: this.anims.generateFrameNumbers('enemigos', {start:4, end: 7}),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'enemigoCaminaDerecha',
            frames: this.anims.generateFrameNumbers('enemigos', {start:0, end: 3}),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'enemigoKill',
            frames: this.anims.generateFrameNumbers('enemigos', {start: 8, end: 12}),
            frameRate: 5,
        })

        this.cameras.main.setBounds(0, 0, 400, 352);
        this.cameras.main.startFollow(player, true);
        this.cameras.main.setZoom(3);

        enemigosGroup.forEach(obj => {
            let enemigo = self.enemigos.create(obj.x+8, obj.y, 'enemigos');
            let numAleatorio = Math.floor(Math.random() * (2 - 0));

            self.children.bringToTop(enemigo);

            if(numAleatorio == 0){
                enemigo.anims.play('enemigoCaminaIzquierda', true);
                enemigo.setVelocityX(-45);
            } else if (numAleatorio == 1) {
                enemigo.anims.play('enemigoCaminaDerecha', true);
                enemigo.setVelocityX(45);
            }


            enemigo.setSize(15, 15, true);
            enemigo.body.offset.y = 16;
        });

        rompiblesArray.forEach(obj => {
                const bloque = self.bloquesRompibles.create(obj.x, obj.y, 'bloqueRoto').setOrigin(0, 0);
                bloque.setImmovable(true);
        });


        this.physics.add.collider(this.enemigos, this.bloquesSolidos, this.enemigoChocaSolido);
        this.physics.add.overlap(this.enemigos, player, this.chocarJugador);
        this.physics.add.collider(player, this.bloquesSolidos);
        this.physics.add.collider(player, this.bloquesRompibles);
        this.physics.add.collider(this.enemigos, this.bloquesRompibles, this.enemigoChocaRompibles);
        this.physics.add.collider(this.enemigos, this.enemigos, this.enemigosChocanEntreSi);


        ///Llamando a la pantalla de pausa
        this.input.keyboard.on('keydown-P', function(pointer) {
            this.scene.remove('pausaNivel_I');
            this.scene.add("pausaNivel_I", new pausaNivel_I);
            this.scene.launch('pausaNivel_I');
            this.scene.pause('Nivel_I');
            musica_fondo.pause();
        }, this);

        this.children.bringToTop(player);

        this.colliders[0] = this.physics.add.collider(player, this.puerta);

        this.marcadores();

        // Cronometro
        this.tiempoAtras = this.formatTime(tiempoDeJuego);
        this.cronometro = this.add.bitmapText(0, 0, 'fuente', this.tiempoAtras, 7);
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });

    }


    formatTime(segundos){
        var minutos = Math.floor(segundos/60);
        var partEnSegundos = segundos%60;
        partEnSegundos = partEnSegundos.toString().padStart(2,'0');

        return `${minutos}:${partEnSegundos}`;
    }


    updateTime(){
        this.tiempoJuego -= 1;
        this.tiempoAtras = this.formatTime(this.tiempoJuego);
        this.cronometro._text = this.tiempoAtras;
        if(this.tiempoJuego == 0){
            this.quitarVida = true;
            this.timedEvent.remove(false);
        }
    }


    marcadores(){
        this.marcador = this.add.image(0, 0, 'marcador').setOrigin(0, 0);
        this.scoreTotal = score.toString().padStart(4, '0');
        this.scoreLabel = this.add.bitmapText(0, 0, 'fuente', "SCORE: "+this.scoreTotal, 7);
        this.vidaLabel = this.add.bitmapText(0, 0, 'fuente', "x" + vidas, 7);
    }

    enemigosChocanEntreSi(sprite1, sprite2){
        let numAlt = Math.floor(Math.random() * (4 - 0));

        switch (numAlt) {
            case 0:
                sprite1.setVelocityY(45);
                sprite1.setVelocityX(0);

                sprite2.setVelocityY(-45);
                sprite2.setVelocityX(0);
                break;

             case 1:
                sprite1.setVelocityY(0);
                sprite1.setVelocityX(45);
                sprite1.anims.play('enemigoCaminaDerecha', true);

                sprite2.setVelocityY(0);
                sprite2.setVelocityX(-45);
                sprite2.anims.play('enemigoCaminaIzquierda', true);
                break;

             case 2:
                sprite1.setVelocityY(0);
                sprite1.setVelocityX(-45);
                sprite1.anims.play('enemigoCaminaIzquierda', true);

                sprite2.setVelocityY(0);
                sprite2.setVelocityX(45);
                sprite2.anims.play('enemigoCaminaDerecha', true);
                break;

            case 3:
                sprite1.setVelocityY(-45);
                sprite1.setVelocityX(0);

                sprite2.setVelocityY(45);
                sprite2.setVelocityX(0);
                break;
        }
    }

    enemigoChocaSolido(sprite, bloque){
        let colision = sprite.body.touching;
        let velocidad = sprite.body.velocity.x;
        let numAlt = Math.floor(Math.random() * (4 - 0));

        switch (numAlt) {
            case 0:
                sprite.setVelocityY(45);
                sprite.setVelocityX(0);
                break;

             case 1:
                sprite.setVelocityY(0);
                sprite.setVelocityX(45);
                sprite.anims.play('enemigoCaminaDerecha', true);
                break;

             case 2:
                sprite.setVelocityY(0);
                sprite.setVelocityX(-45);
                sprite.anims.play('enemigoCaminaIzquierda', true);
                break;

            case 3:
                sprite.setVelocityY(-45);
                sprite.setVelocityX(0);
                break;
        }

        self.children.bringToTop(sprite);
        self.children.bringToTop(self.marcador);
        self.children.bringToTop(self.scoreLabel);
        self.children.bringToTop(self.vidaLabel);
    }

    enemigoChocaRompibles(sprite){
        let colision = sprite.body.touching;
        let velocidad = sprite.body.velocity.x;
        let numAlt = Math.floor(Math.random() * (4 - 0));

        switch (numAlt) {
            case 0:
                sprite.setVelocityY(45);
                sprite.setVelocityX(0);
                break;

             case 1:
                sprite.setVelocityY(0);
                sprite.setVelocityX(45);
                sprite.anims.play('enemigoCaminaDerecha', true);
                break;

             case 2:
                sprite.setVelocityY(0);
                sprite.setVelocityX(-45);
                sprite.anims.play('enemigoCaminaIzquierda', true);
                break;

            case 3:
                sprite.setVelocityY(-45);
                sprite.setVelocityX(0);
                break;
        }

    }



    crearBomba(){
        let temporizador;
        let contador = 0;
        let boom;
        let bombaCopia;
        let posicion_x = player.x;
        let posicion_y = player.y+5;
        let arrayMultiplos_x = [];
        let arrayMultiplos_y = [];
        let menor_x;
        let mayor_x;
        let menor_y;
        let mayor_y;
        let ponerBombaSonido = this.sound.add('ponerBombaSound');

        ponerBombaSonido.play();

        for (let i = 23; i < posicion_x; i++) {
            let posicion = i
            arrayMultiplos_x.push(posicion);
            i+=15;
        }

        menor_x = arrayMultiplos_x.pop();
        mayor_x = menor_x + 16;

        if((mayor_x - posicion_x) > (posicion_x - menor_x)){
            posicion_x = menor_x;
        }

        if((mayor_x - posicion_x) < (posicion_x - menor_x)){
            posicion_x = mayor_x;
        }



        for (let i = 55; i < posicion_y; i++) {
            let posicion = i
            arrayMultiplos_y.push(posicion);
            i+=15;
        }

        menor_y = arrayMultiplos_y.pop();
        mayor_y = menor_y + 16;

        if((mayor_y - posicion_y) > (posicion_y - menor_y)){
            posicion_y = menor_y;
        }

        if((mayor_y - posicion_y) < (posicion_y - menor_y)){
            posicion_y = mayor_y;
        }


        bomba = self.physics.add.sprite(posicion_x, posicion_y, 'bomba');
        bomba.anims.play('setBomba', true);
        bomba.setSize(15, 15, true);



        // Colisiones
        self.physics.add.collider(bomba, player);
        self.physics.add.collider(bomba, self.bloquesSolidos);

        self.enemigos.getChildren().forEach(enemigo => {
            self.physics.add.collider(enemigo, bomba, self.enemigoChocaSolido);
        })


        bomba.setImmovable(true);
        bombaCopia = bomba


        // Tiempo antes de que explote la bomba
        temporizador = setInterval(function(){
            contador++;
            if(contador == tiempoBomba){
                bomba.destroy();
                clearInterval(temporizador);
                bomba = undefined;
                boom = true;
                if(boom){
                    self.explotarBomba(bombaCopia);
                }
            }
        }, 1000);
    }

    explotarBomba(bomba){
        let explosion;
        let explosionSonido = this.sound.add('explosionSound');
        let alcance_derecha;
        let expFinal_derecha;
        let alcance_izquierda;
        let expFinal_izquierda;
        let alcance_arriba;
        let expFinal_arriba;
        let alcance_abajo;
        let expFinal_abajo;
        let x = bomba.x+1;
        let y = bomba.y+1;
        let tiempoExplosion = 1;
        let tiempoEnMuestra;
        let contador = 0;

        explosionSonido.play();

        explosion = self.physics.add.sprite(x, y, 'explosion');
        explosion.anims.play('boom', true);
        explosion.setSize(36, 36, true);
        explosion.setScale(0.32);

        alcance_derecha = self.physics.add.sprite(x+15, y, 'explosion');
        alcance_derecha.anims.play('boomAlcance', true);
        alcance_derecha.setSize(36, 36, true);
        alcance_derecha.setScale(0.32);


        expFinal_derecha = self.physics.add.sprite(alcance_derecha.x+15, y, 'explosion');
        expFinal_derecha.anims.play('boomFinal', true);
        expFinal_derecha.setSize(36, 36, true);
        expFinal_derecha.setScale(0.32);

        alcance_izquierda = self.physics.add.sprite(x-15, y, 'explosion');
        alcance_izquierda.angle = 180;
        alcance_izquierda.anims.play('boomAlcance', true);
        alcance_izquierda.setSize(36, 36, true);
        alcance_izquierda.setScale(0.32);


        expFinal_izquierda = self.physics.add.sprite(alcance_izquierda.x-15, y, 'explosion');
        expFinal_izquierda.angle = 180
        expFinal_izquierda.anims.play('boomFinal', true);
        expFinal_izquierda.setSize(36, 36, true);
        expFinal_izquierda.setScale(0.32);


        alcance_arriba = self.physics.add.sprite(x, y-15, 'explosion');
        alcance_arriba.angle = -90;
        alcance_arriba.anims.play('boomAlcance', true);
        alcance_arriba.setSize(36, 36, true);
        alcance_arriba.setScale(0.32);


        expFinal_arriba = self.physics.add.sprite(x, alcance_arriba.y-15, 'explosion');
        expFinal_arriba.angle = -90;
        expFinal_arriba.anims.play('boomFinal', true);
        expFinal_arriba.setSize(36, 36, true);
        expFinal_arriba.setScale(0.32);


        alcance_abajo = self.physics.add.sprite(x, y+15, 'explosion');
        alcance_abajo.angle = 90;
        alcance_abajo.anims.play('boomAlcance', true);
        alcance_abajo.setSize(36, 36, true);
        alcance_abajo.setScale(0.32);


        expFinal_abajo = self.physics.add.sprite(x, alcance_abajo.y+15, 'explosion');
        expFinal_abajo.angle = 90;
        expFinal_abajo.anims.play('boomFinal', true);
        expFinal_abajo.setSize(36, 36, true);
        expFinal_abajo.setScale(0.32);

        //Colision de la explosion con bloques solidos
        self.physics.add.collider(alcance_derecha, self.bloquesSolidos, function(){
            alcance_derecha.destroy();
            alcance_derecha.isDestroyed = true;

            if(alcance_derecha.isDestroyed){
                expFinal_derecha.destroy();
            }
        });

        self.physics.add.collider(alcance_izquierda, self.bloquesSolidos, function(){
            alcance_izquierda.destroy();
            alcance_izquierda.isDestroyed = true;

            if(alcance_izquierda.isDestroyed){
                expFinal_izquierda.destroy();
            }
        });

        self.physics.add.collider(alcance_arriba, self.bloquesSolidos, function(){
            alcance_arriba.destroy();
            alcance_arriba.isDestroyed = true;

            if(alcance_arriba.isDestroyed){
                expFinal_arriba.destroy();
            }
        });

        self.physics.add.collider(alcance_abajo, self.bloquesSolidos, function(){
            alcance_abajo.destroy();
            alcance_abajo.isDestroyed = true;

            if(alcance_abajo.isDestroyed){
                expFinal_abajo.destroy();
            }
        });

        self.physics.add.collider(expFinal_derecha, self.bloquesSolidos, self.chocarSolido);
        self.physics.add.collider(expFinal_izquierda, self.bloquesSolidos, self.chocarSolido);
        self.physics.add.collider(expFinal_arriba, self.bloquesSolidos, self.chocarSolido);
        self.physics.add.collider(expFinal_abajo, self.bloquesSolidos, self.chocarSolido);


        //////// Colision de la explosion con bloques que se pueden romper

        self.bloquesRompibles.getChildren().forEach(bloque => {

            self.physics.add.collider(alcance_abajo, bloque, function(){
                let contadorBloque = 0;
                let tiempoEnMuestraBloque;

                alcance_abajo.alpha = 0;

                expFinal_abajo.destroy();


                self.children.bringToTop(bloque);
                bloque.anims.play('explotaBloque', true);

                tiempoEnMuestraBloque = setInterval(function(){
                    contadorBloque ++;
                    if(contadorBloque == 1) {
                        bloque.destroy();
                        clearInterval(tiempoEnMuestraBloque);
                    }
                }, 1000);
            });

            self.physics.add.collider(alcance_arriba, bloque, function(){
                let contadorBloque = 0;
                let tiempoEnMuestraBloque;

                alcance_arriba.alpha = 0;

                expFinal_arriba.destroy();


                self.children.bringToTop(bloque);
                bloque.anims.play('explotaBloque', true);

                tiempoEnMuestraBloque = setInterval(function(){
                    contadorBloque ++;
                    if(contadorBloque == 1) {
                        bloque.destroy();
                        clearInterval(tiempoEnMuestraBloque);
                    }
                }, 1000);
            });

             self.physics.add.collider(alcance_derecha, bloque, function(){
                let contadorBloque = 0;
                let tiempoEnMuestraBloque;

                alcance_derecha.alpha = 0;

                expFinal_derecha.destroy();

                self.children.bringToTop(bloque);
                bloque.anims.play('explotaBloque', true);

                tiempoEnMuestraBloque = setInterval(function(){
                    contadorBloque ++;
                    if(contadorBloque == 1) {
                        bloque.destroy();
                        clearInterval(tiempoEnMuestraBloque);
                    }
                }, 1000);


            });

             self.physics.add.collider(alcance_izquierda, bloque, function(){
                let contadorBloque = 0;
                let tiempoEnMuestraBloque;

                alcance_izquierda.alpha = 0;

                expFinal_izquierda.destroy();

                self.children.bringToTop(bloque);
                bloque.anims.play('explotaBloque', true);

                tiempoEnMuestraBloque = setInterval(function(){
                    contadorBloque ++;
                    if(contadorBloque == 1) {
                        bloque.destroy();
                        clearInterval(tiempoEnMuestraBloque);
                    }
                }, 1000);
            });

            self.physics.add.collider(expFinal_arriba, bloque, self.destruirBloque);
            self.physics.add.collider(expFinal_abajo, bloque, self.destruirBloque);
            self.physics.add.collider(expFinal_izquierda, bloque, self.destruirBloque);
            self.physics.add.collider(expFinal_derecha, bloque, self.destruirBloque);

        });



        //Colision entre el jugador y la explosion

        self.physics.add.overlap(explosion, player, self.chocarJugador);
        self.physics.add.overlap(alcance_derecha, player, self.chocarJugador);
        self.physics.add.overlap(alcance_izquierda, player, self.chocarJugador);
        self.physics.add.overlap(alcance_arriba, player, self.chocarJugador);
        self.physics.add.overlap(alcance_abajo, player, self.chocarJugador);

        self.physics.add.overlap(expFinal_derecha, player, self.chocarJugador);
        self.physics.add.overlap(expFinal_izquierda, player, self.chocarJugador);
        self.physics.add.overlap(expFinal_arriba, player, self.chocarJugador);
        self.physics.add.overlap(expFinal_abajo, player, self.chocarJugador);

        self.children.bringToTop(player);


        //Sobreposiocion del enemigo sobre la explosion

        self.overlapTriggered = false;

        self.enemigos.getChildren().forEach(enemigo => {

            self.physics.add.collider(alcance_arriba, enemigo, function(){
                let contador = 0;
                let tiempoEnMuestra;
                let tmp;
                tmp = self.physics.add.sprite(alcance_arriba.x, alcance_arriba.y, 'explosion');
                tmp.anims.play('boomAlcance', true);
                tmp.setSize(36, 36, true);
                tmp.setScale(0.32);
                tmp.setImmovable(true);
                tmp.angle = -90;


                alcance_arriba.destroy();
                self.children.bringToTop(enemigo);

                enemigo.setVelocityY(0);
                enemigo.setVelocityX(0);

                expFinal_arriba.destroy();

                enemigo.anims.play('enemigoKill', true);

                tiempoEnMuestra = setInterval(function(){
                    contador ++;
                    if(contador == 1) {
                        enemigo.destroy();
                        tmp.destroy();
                        score += 100;
                        self.scoreTotal = score.toString().padStart(4, '0');
                        clearInterval(tiempoEnMuestra);
                    }
                }, 1000);
            });

           self.physics.add.collider(alcance_abajo, enemigo, function(){
                let contador = 0;
                let tiempoEnMuestra;
                let tmp;
                tmp = self.physics.add.sprite(alcance_abajo.x, alcance_abajo.y, 'explosion');
                tmp.anims.play('boomAlcance', true);
                tmp.setSize(36, 36, true);
                tmp.setScale(0.32);
                tmp.setImmovable(true);
                tmp.angle = 90;

                alcance_abajo.destroy();
                self.children.bringToTop(enemigo);

                enemigo.setVelocityY(0);
                enemigo.setVelocityX(0);

                expFinal_abajo.destroy();

                enemigo.anims.play('enemigoKill', true);

                tiempoEnMuestra = setInterval(function(){
                    contador ++;
                    if(contador == 1) {
                        enemigo.destroy();
                        tmp.destroy();
                        score += 100;
                        self.scoreTotal = score.toString().padStart(4, '0');
                        clearInterval(tiempoEnMuestra);
                    }
                }, 1000);
            });

            self.physics.add.collider(alcance_derecha, enemigo, function(){
                let contador = 0;
                let tiempoEnMuestra;
                let tmp;
                tmp = self.physics.add.sprite(alcance_derecha.x, alcance_derecha.y, 'explosion');
                tmp.anims.play('boomAlcance', true);
                tmp.setSize(36, 36, true);
                tmp.setScale(0.32);
                tmp.setImmovable(true);

                expFinal_derecha.destroy();

                alcance_derecha.destroy();
                self.children.bringToTop(enemigo);

                enemigo.setVelocityY(0);
                enemigo.setVelocityX(0);


                enemigo.anims.play('enemigoKill', true);

                tiempoEnMuestra = setInterval(function(){
                    contador ++;
                    if(contador == 1) {
                        enemigo.destroy();
                        tmp.destroy();
                        score += 100;
                        self.scoreTotal = score.toString().padStart(4, '0');
                        clearInterval(tiempoEnMuestra);
                    }
                }, 1000);
            });

            self.physics.add.collider(alcance_izquierda, enemigo, function(){
                let contador = 0;
                let tiempoEnMuestra;
                let tmp;
                tmp = self.physics.add.sprite(alcance_izquierda.x, alcance_izquierda.y, 'explosion');
                tmp.anims.play('boomAlcance', true);
                tmp.setSize(36, 36, true);
                tmp.setScale(0.32);
                tmp.setImmovable(true);

                expFinal_izquierda.destroy();

                alcance_izquierda.destroy();
                self.children.bringToTop(enemigo);

                enemigo.setVelocityY(0);
                enemigo.setVelocityX(0);

                enemigo.anims.play('enemigoKill', true);

                tiempoEnMuestra = setInterval(function(){
                    contador ++;
                    if(contador == 1) {
                        enemigo.destroy();
                        tmp.destroy();
                        score += 100;
                        self.scoreTotal = score.toString().padStart(4, '0');
                        clearInterval(tiempoEnMuestra);
                    }
                }, 1000);
            });

            self.physics.add.collider(expFinal_derecha, enemigo, self.matarEnemigo);
            self.physics.add.collider(expFinal_izquierda, enemigo, self.matarEnemigo);
            self.physics.add.collider(expFinal_arriba, enemigo, self.matarEnemigo);
            self.physics.add.collider(expFinal_abajo, enemigo, self.matarEnemigo);

            self.children.bringToTop(enemigo);
        });

       tiempoEnMuestra = setInterval(function(){
            contador ++;
            if(contador == tiempoExplosion){
                explosion.destroy();
                alcance_derecha.destroy();
                expFinal_derecha.destroy();
                alcance_izquierda.destroy();
                expFinal_izquierda.destroy();
                alcance_arriba.destroy();
                expFinal_arriba.destroy();
                alcance_abajo.destroy();
                expFinal_abajo.destroy();
                explosionSonido.pause();
                clearInterval(tiempoEnMuestra);
            }
        }, 1000);

    }

     matarEnemigo(explosion, enemigo){
        let contador = 0;
        let tiempoEnMuestra;

        enemigo.setVelocityY(0);
        enemigo.setVelocityX(0);

        explosion.setImmovable(true);
        explosion.setVelocityY(0);
        explosion.setVelocityX(0);

        if(self.overlapTriggered){
            return;
        }

        self.overlapTriggered = true;


        enemigo.anims.play('enemigoKill', true);


        tiempoEnMuestra = setInterval(function(){
            contador++;
            if(contador == 1){
                enemigo.destroy();
                score += 100;
                self.scoreTotal = score.toString().padStart(4, '0');
                clearInterval(tiempoEnMuestra);
            }
        }, 1000);


    }

    destruirBloque(explosion, bloque){
        let contadorBloque = 0;
        let tiempoEnMuestraBloque;

        explosion.alpha = 0;

        self.children.bringToTop(bloque);
        bloque.anims.play('explotaBloque', true);

        tiempoEnMuestraBloque = setInterval(function(){
            contadorBloque ++;
            if(contadorBloque == 1) {
                bloque.destroy();
                clearInterval(tiempoEnMuestraBloque);
            }
        }, 1000);
    }

    chocarJugador(){
        self.quitarVida = true;
    }

    chocarSolido(anim, bloque){
        anim.destroy();
    }

    abrirPuerta(){
        self.puerta.setSize(15, 15, true);
        self.puerta.body.offset.y = 6;
        self.puerta.anims.play('abrirPuerta', true);
        self.physics.world.removeCollider(self.colliders[0]);
        self.physics.add.overlap(player, self.puerta, self.irSiguienteNivel);
        self.timedEvent.remove(false);
        self.puertaAbierta = true;
        contador = 0;
    }

    reiniciarEscena(){
        vidas--;
        haReiniciado = true;

        if(vidas != 0){
            contador = 0;
            self.scene.start('PNivel1');
        }else{
            score = 0;
            contador = 0;
            self.limpiarCache();
            self.scene.add('GameOver', new GameOver);
            self.scene.start('GameOver');
        }

    }

    irSiguienteNivel(){
        let temporizador;
        if(!self.pasarNivel){
            self.ganarSound.play();
            musica_fondo.pause();
            self.pasarNivel = true;
            temporizador = setInterval(function(){
                contador++;
                if(contador == 2){
                    self.cameras.main.fadeOut(1000);
                }

                if(contador == 5){
                    self.scene.add("PNivel2", new PNivel2);
                    self.scene.start("PNivel2");
                    self.limpiarCache();
                    self.ganarSound.pause();
                    clearInterval(temporizador);
                }

            }, 1000);

        }else {
            return
        }
    }

    limpiarCache(){
        self.game.cache.tilemap.remove('mapa');
        self.game.cache.audio.remove('ganarSound');
        self.game.cache.audio.remove('fondo');
        self.textures.removeKey('enemigos');
        self.textures.removeKey('puerta');
        self.textures.removeKey('bloqueRoto');
        self.textures.removeKey('tiles');
        self.textures.removeKey('perder');
        self.textures.removeKey('bomberman');
        self.textures.removeKey('bomba');
        //self.textures.removeKey('fuente');
        self.anims.remove('enemigoCaminaIzquierda');
        self.anims.remove('enemigoCaminaDerecha');
        self.anims.remove('enemigoKill');
        self.anims.remove('explotaBloque');
        self.anims.remove('abrirPuerta');
        self.anims.remove('setBomba');
    }


    update ()
    {

        this.marcador.x = this.cameras.main.worldView.x-1;
        this.marcador.y = this.cameras.main.worldView.y-1;

        this.scoreLabel.x = this.cameras.main.worldView.x + 190;
        this.scoreLabel.y = this.cameras.main.worldView.y + 14;

        this.vidaLabel.x = this.cameras.main.worldView.x + 50;
        this.vidaLabel.y = this.cameras.main.worldView.y + 14;

        this.cronometro.x = this.cameras.main.worldView.x + 120;
        this.cronometro.y = this.cameras.main.worldView.y + 14;
        this.children.bringToTop(this.cronometro);

        this.scoreLabel._text = "SCORE: "+this.scoreTotal;

        this.enemiesCount = this.enemigos.countActive();


        if(!this.quitarVida){

            if (this.cursors.left.isDown)
            {
                player.setVelocityX(-70);
                player.setVelocityY(0);
                player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                player.setVelocityX(70);
                player.setVelocityY(0);
                player.anims.play('right', true);
            }

            else  if (this.cursors.up.isDown)
            {
                player.setVelocityY(-70);
                player.setVelocityX(0);
                player.anims.play('up', true);

            }else if (this.cursors.down.isDown)
            {
                player.setVelocityY(70);
                player.setVelocityX(0);
                player.anims.play('down', true);
            }
            else
            {
                player.setVelocityY(0);
                player.setVelocityX(0);
                player.anims.play('turn', true);
            }


            if(this.ponerBomba.isDown && bomba == undefined){
                this.crearBomba();
            }

            if(this.enemiesCount == 0 && !this.puertaAbierta){
                this.abrirPuerta();
            }


        } else if (this.quitarVida){
            player.setSize(13, 13, true);
            //player.body.offset.y=10;
            player.anims.play('tocarExplosion', true);
            musica_fondo.pause();

            if(player.frame.name == 3){
                contador++;

                if(contador == 19){
                    self.cameras.main.fadeOut(500);
                }

                if (contador == 27){
                    self.reiniciarEscena();
                }
            }
        }
    }
}
