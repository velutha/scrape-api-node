var mongoose = require('mongoose');

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

module.exports = db
