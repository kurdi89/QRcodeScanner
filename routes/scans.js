const express = require('express');
const { scanCodes } = require('../controllers/codes');

const router = express.Router();

router
  .route('/:id')
  .get(scanCodes) // when GET update the code


module.exports = router;
