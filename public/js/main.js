var posX = 0;
var capteur = 0;

( function( w, d, u ){
		var socket = io();

		socket.on( 'data', function( data ){
				console.log( data );
				capteur = data;
		} );
} )( window, document, undefined );

function setup(){
		createCanvas( windowWidth, windowHeight );
}

function draw(){
		background( '#136666' );
		posX = map( capteur, 380, 715, width, 0 );
		ellipse( posX, height/2, 50, 50 );
}
