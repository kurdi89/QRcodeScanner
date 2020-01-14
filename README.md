# QR Code Scanned

> Node/Express/Mongo API with QR codes example for a single use QR code demo for a good UX.

## Quick Start

you will need Node.js on your machine download from [here](https://nodejs.org/en/download/)

Add your MONGO_URI to the "config/config.env" file, please use your own API, checkout MongoDB Atlas [here](https://www.mongodb.com/cloud/atlas)

replace `<username>:<passoword>` with your DB password, *may not be the same not your atlas password, you can generate passwords from atlas*

makesure to whitlelist your current IP on atlas or assign it to any IP address `0.0.0.0`
[Tutorial : Getting started with the MongoDB Atlas free tier - Free MongoDB hosting](https://www.youtube.com/watch?v=_d8CBOtadRA)

Start :

```bash
# Install dependencies
npm install

# Serve on localhost:5000
nodemon
or
npm run dev (nodemon)
or
npm start

# Routes
GET    /api/v1/codes # Get codes

POST   /api/v1/codes # Add code

DELETE /api/v1/codes # deletes a code

PUT /scan/:id # updates a code to scanned
```

:+1:

*if you get :*

```batch
(node:12368) UnhandledPromiseRejectionWarning: #<Object>
(node:12368) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:12368) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

it means you are not connect to the MongoDB.
