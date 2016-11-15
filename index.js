// Main starting point of out server
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// making an instance of express
const app = express();
const router = require('./router')

router(app);

// Connecting to our dataBase this is
// also where you name your db
mongoose.connect('mongodb://localhost:auth/auth')


// App SetUp

// middleware in express -
// any request will be sent throught them

// morgan is a logging frame work: mostly for debuggin
app.use(morgan('combined'));
// bodyParser will parse incoming request:
// parsed as though it was JSON
app.use(bodyParser.json({ type: '*/*'}));

// Server SetUp
const port = process.env.PORT || 3090;

// create an http server and push it to our app
const server = http.createServer(app);
server.listen(port);
console.log('server listening on', port);
