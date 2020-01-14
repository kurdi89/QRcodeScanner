const http = require("http");
const fs = require("fs");
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

// ngrok : 
const ngrok = require('ngrok');

// load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser :
// app.use(express.json());
// Body parser :
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Enable cors
app.use(cors());

// Main Route : 
app.get('/', (req, res) => {
  res.sendFile('./public/index.html', { root: __dirname });
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// build folder :
app.use('/build/qrcode', express.static(path.join(__dirname, 'node_modules/qrcode/build/')));

// Routes
app.use('/api/v1/codes', require('./routes/codes'));
app.use('/scan', require('./routes/scans'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


// exposing the PORT to ngrok (localhost to public): 
(async function() {
  const url = await ngrok.connect(PORT);
  console.log('url', url)
  // fetch URL by ngrok to /link Route :
  app.get('/link', (req, res) => {
      res.status(200).send({
        success: true,
        data: url
      });
  });
})();



// creating a server :
// http.createServer(function(req, res) {
//   // Homepage
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("Welcome to the homepage!");
//   }

//   // About page
//   else if (req.url === "/about") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("Welcome to the about page!");
//   }

//   // 404'd!
//   else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("404 error! File not found.");
//   }
// }).listen(1337, "localhost");
