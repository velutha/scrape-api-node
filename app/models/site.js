var db = require('../../connection')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var siteSchema = new Schema({
  url: String,
  elements: [{
    widgetName: String,
    left: Number,
    top: Number,
    height: Number,
    width: Number,
    screenHeight: Number,
    screenWidth: Number
  }]
});

var Site = db.model('Site', siteSchema)

module.exports = Site
