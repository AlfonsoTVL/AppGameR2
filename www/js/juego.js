var app={
inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    ptos = 0;
	tocaborde = false;			// detecta la salida del area de juego
	mesalgo = 0;				// solo resto puntos si toco durante 100ms
    alto  = document.documentElement.clientHeight; //Ajustamos el juego a la pantalla
    ancho = document.documentElement.clientWidth;
    app.vigilaSensores();
    app.iniciaJuego();
},

iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.stage.backgroundColor = '000000'; // '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
	  game.load.image('objetivo2', 'assets/objetivo2.png');
	  game.load.image('estrella', 'assets/star.png');
    }

    function create() {
      scorTx = game.add.text(12, 12, 'Puntos:', { fontSize: '48px', fill: '#800909' });
      scorVl = game.add.text(180, 12, ptos, { fontSize: '48px', fill: '#757676' });
	  legend1 = game.add.text(8, 500, 'Alcanza al imperio (1 pto) o a la estrella (3 ptos)', { fontSize: '16px', fill: '#1616ff' });
	  legend2 = game.add.text(8, 524, '¡Pero no te salgas del hiperespacio (resta -1 pto)!', { fontSize: '16px', fill: '#1616ff' });
	  legend3 = game.add.text(8, 548, 'Agita tu móvil para reiniciar', { fontSize: '16px', fill: '#64ff64'});
	  estrellaN = game.add.group();
	  for (i=0; i<25; i++){
		  app.creaEstrellas(); };		// Llenamos el espacio de estrellas
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
	  objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo2);
      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.meHostio, this); //funcion llamada si toco borde
    }
	
	function update(){
      var factorDificil = (250 + (dificultad * 75));
      bola.body.velocity.y = (velocidadY * factorDificil);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificil));
	    if (tocaborde === true){	// si toco el borde flasheo de rojo
		   game.stage.backgroundColor='#ff3300';
		   mesalgo++;				// e incremento contador (a los 10 toques penaliza)
		   tocaborde = false;
		   }
		else{
			game.stage.backgroundColor = '#000000';
	    };
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntos1, null, this);
	  game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntos2, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
},

creaEstrellas: function(){
	estrellax = estrellaN.create(app.inicioX(), app.inicioY(), 'estrella');
},

meHostio: function(){
	tocaborde = true;
	app.decrementaPuntuacion(mesalgo);
},

decrementaPuntuacion: function(){
	if (mesalgo == 10){				// a los 10 microtoques (o 100ms) penaliza 
		ptos = ptos-1;
		scorVl.text = ptos;
		mesalgo = 0;
	}
},

incrementaPuntos1: function(){
	app.incrementaPuntuacion(3);
	objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();
},

incrementaPuntos2: function(){
	app.incrementaPuntuacion(1);
	objetivo2.body.x = app.inicioX();
    objetivo2.body.y = app.inicioY();
},

incrementaPuntuacion: function(puntos){
    ptos = ptos + puntos;
    scorVl.text = ptos;
    if (ptos > 0){			// Conforme avancemos, el manejo se hará mas dificil
       dificultad = dificultad + 1;
    }
	else{					// Si caemos a cero, se restablece a dificultad
	dificultad = 1}
},

inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
},

inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
},

numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
},

vigilaSensores: function(){
    function onError() {
        console.log('onError!');
    }
    function onSuccess(datosAceleracion){
       app.detectaAgitacion(datosAceleracion);
       app.registraDireccion(datosAceleracion);
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
},

detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;
    if (agitacionX || agitacionY){
        setTimeout(app.recomienza, 500);
    }
},

recomienza: function(){
    document.location.reload(true);
},

registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
}
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}