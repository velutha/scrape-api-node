var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uri = "mongodb://localhost/SampleNode"
var options = {
  user: 'sample_node',
  password: 'foobar123'
}

var db = mongoose.connect(uri,options, function(err,res){
  if(err){
    console.log('error connecting to ' + uri);
    console.log(err);
  } else {
    console.log(db.connection.host);
    console.log(db.connection.port);
    console.log('successfully connected to '+ uri);
  }
});

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
