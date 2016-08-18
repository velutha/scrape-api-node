var db = require('../../connection')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var siteSchema = new Schema({
  url: String,
  screenHeight: Number,
  screenWidth: Number,
  elements: [{
    widgetName: String,
    left: Number,
    top: Number,
    height: Number,
    width: Number,
  }]
});

var Site = db.model('Site', siteSchema)

module.exports = Site
