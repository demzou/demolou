/*
 * Config
 */
const express = require('express');   //Dependencies
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(`${__dirname}/public`));



/*
 * socket.io
 */

const http = require("http");         //Dependencies
const server = http.createServer(app);
server.listen(port);


// Setup sockets with the HTTP server
const socketio = require('socket.io');
const { match } = require('assert');
let io = socketio.listen(server);
console.log(`Listening for socket connections on port ${port}`);


//-------------------------------------
// Manage behaviour of all the devices in parallel, allowing for multi-clicks
// Check if someone is clicking on a button and send buzz instructions to everyone
let buttonCount = 0;

setInterval( function() {
  sendBuzz();
}, 300);                            // sampling every 300 ms

function sendBuzz() {
  if(buttonCount > 0) {
    io.sockets.emit('buzz', '1');   //if at least one person clicked, everyone is buzzing
    //console.log('sent buzz: 1');
  } else { 
    io.sockets.emit('buzz', '0');
    //console.log('sent Buzz: 0');
  }
buttonCount = 0;                    // reset count at the end of the interval
}

//-------------------------------------
// Register a callback function to run when we have an individual connection
// This is run for each individual client that connects
io.sockets.on('connection',
  // Callback function to call whenever a socket connection is made
  function (socket) {

    // Print message to the console indicating that a new client has connected
    console.log("New client: " + socket.id);


    //----------> Manage button clicks
    socket.on('button',
    function(data) {
        if(data == 1) {
          buttonCount++;           // if someone clicks, increase buttonCount
        }
       //console.log('button: ' + data);
      }
    );
    //----------
      
    
    // Specify a callback function to run when the client disconnects
    socket.on('disconnect',
      function() {
        console.log("Client has disconnected: " + socket.id);
        // remove socket 
      }
    );
  }
);