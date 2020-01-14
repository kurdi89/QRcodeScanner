const Code = require('../models/Code');
const io = require('socket.io')(process.env.IO || 5001);

const http = require("http");
const fs = require("fs");
const path = require('path');

// @desc  Get all codes
// @route GET /api/v1/codes
// @access Public
exports.getCodes = async (req, res, next) => {
  try {
    const codes = await Code.find();

    return res.status(200).json({
      success: true,
      count: codes.length,
      data: codes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Create a code
// @route POST /api/v1/codes
// @access Public
exports.addCodes = async (req, res, next) => {
  try {
    const code = await Code.create(req.body);

    return res.status(200).json({
      success: true,
      data: code
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This code already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Delete a code
// @route DELETE /api/v1/codes
// @access Public (should be private)
exports.deleteCodes = async (req, res, next) => {
  try {
    const id = req.body.id;
    const data = {id};

    console.log('req.body', req.body)
    await Code.findByIdAndRemove({ _id: req.body.id })
      .exec(function(err, item) {
      if (err) {
        data.msg = 'error';
        return res.json({success: false, data});
      }       
      if (!item) {
        data.msg = 'error';
        return res.status(404).json({success: false, data});
      } 
      data.msg = 'success';
        res.status(200).json({success: true, data, item});
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This code already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  PUT a code
// @route PUT /scans/:id by parameter
// @access Public
var options = {
  root: path.join(__dirname, '../', 'public/'),
};

exports.scanCodes = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = {id};
    console.log('Scanned :', req.params.id)

    await Code.findByIdAndUpdate({ _id: id }, {scanned : true})
      .exec(function(err, item) {
      if (err) {
        data.msg = 'error';
        return res.json({success: false, data});
      }       
      if (!item) {
        data.msg = 'error';
        return res.status(404).json({success: false, data});
      } 

      // emit on websocket :
      io.emit('scanned', id)
      data.msg = 'success';
      // redirect :
      res.status(200).sendFile('scan.html', options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
      });
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This code already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
