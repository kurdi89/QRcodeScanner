const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  scanned: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Code', CodeSchema);
