var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var phantom = require('phantom');
var json2csv = require('json2csv');

var app = express();

var Site = require('./app/models/site');

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

// define port here
var port = process.env.PORT || 8080;

// using express router

var router = express.Router(); 

router.get('/',function(req,res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var site = query.site;
  //console.log(site);
  if(site === undefined){
    console.log('Site param not found');
    res.json({message: 'Give me a site param to work with'});
  }
  else {
    var sitepage = null;
    var phInstance = null;
    var screenWidth = 1024;
    var screenHeight = 768;
    phantom.create()
      .then(function(instance){
          phInstance = instance;
          return instance.createPage();
      })
      .then(function(page){
          sitepage = page;
          return page.open('https://'+site);
      })
      .then(function(status){
        if (status !== 'success'){
          console.log('unable to connect to site');
          res.send({message: 'Unable to connect to site'});
        } else {
          console.log('Connected to site');
          var mainContent = sitepage.property('viewportSize', {width: screenWidth, height: screenHeight})
          .then(function() {
              var content = sitepage.evaluate(function(){
                var nodes = []
                var nodeList = document.querySelectorAll('[k-widget]');
                for(var i = 0; i< nodeList.length; i++){
                  var jQNode = jQuery(nodeList[i])
                  var widgetName = jQNode.attr('k-widget');
                  var position = jQNode.position();
                  var height = jQNode.height();
                  var width = jQNode.width();
                  nodes.push({
                    'widgetName': widgetName,
                    'left': position.left,
                    'top': position.top,
                    'height': height,
                    'width': width,
                  });
                }
                return nodes;
              });
              return content;
          });
          return mainContent;
        }
      })
      .then(function(content){
          console.log(content);
          var newSite = new Site({
            url: site,
            screenHeight: screenHeight,
            screenWidth: screenWidth,
            elements: content
          })
          newSite.save(function(err){
            if (err){
              console.log('error saving to database');
              console.log(err);
              res.send({message: 'Something gone wrong. Please reach out to admin'});
            } else {
              if (content !== undefined) {
                for (var i = 0; i< content.length; i++) {
                  content[i]['screenHeight'] = screenHeight;
                  content[i]['screenWidth'] = screenWidth;
                }
                var csvResponse = json2csv({data: content, fields: ['widgetName','left','top','height','width','screenWidth','screenHeight',]})
                res.send(csvResponse);
              }
            }
          });
          sitepage.close();
          phInstance.exit();
      })
      .catch(function(error){
          res.send(error);
          phInstance.exit();
      });
  }
});

// define your routes here
app.use('/api',router);

app.listen(port, function(){
  console.log('server starting on port '+ port);
});
