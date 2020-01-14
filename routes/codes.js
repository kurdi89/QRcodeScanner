const express = require('express');
const { getCodes, addCodes, deleteCodes } = require('../controllers/codes');

const router = express.Router();

router
  .route('/')
  .get(getCodes)
  .post(addCodes)
  .delete(deleteCodes);

module.exports = router;
