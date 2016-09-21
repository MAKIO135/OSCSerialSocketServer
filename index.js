var config = require( './config' ),

    express = require( 'express' ),
    app = express(),
    http = require( 'http' ).Server( app ),
    io = require( 'socket.io' )( http )
	osc = require( 'osc' ),
    SerialPort = require( 'serialport' );


// Create the HTTP Server
http.listen( config.serverPort, function(){
    console.log( 'listening on', config.serverPort );
} );


// Tell the app where the files are and what page to serve
app.use( express.static( __dirname + '/public' ) );
app.get( '/', function( req, res ){
    res.sendFile( 'index.html' );
} );


// Websocket communication between Node Server and Browser
io.on( 'connection', function( socket ){
    console.log( 'a user connected' );
    socket.emit( 'hi' );

    socket.on( 'msg', function( msg ){
        console.log( msg );
        io.emit( msg );

        if( config.useOSC ){
        	oscPort.send( {
        		address: '/new_msg',
        		args: [ msg, 1 ]
        	}, '127.0.0.1', config.udpPort + 1 );
        }

    } );

    socket.on( 'disconnect', function(){
        console.log( 'user disconnected' );
    } );
} );

if( config.useArduino ){
    var serialPort = new SerialPort( config.serialPort, {
        baudrate: config.serialRate,
        parser: SerialPort.parsers.readline( '\n' )
    } );

    // Serial communication between Node Server and Arduino
    serialPort.on( 'open', function () {
        console.log( config.serialPort + ' open' );

        serialPort.on( 'data', function( data ) {
            console.log( 'data received: ' + data );
            io.emit( 'data', data );
        } );
    } );
}

if( config.useOSC ){
    var oscPort = new osc.UDPPort( {
    	localAddress: config.oscIP,
    	localPort: config.oscPort
    } );

    oscPort.open();

    oscPort.on( 'message', function(data){
        console.log( 'data received: ' + data );
        io.emit( 'data', data );
    } );
}
