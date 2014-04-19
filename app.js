
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var db = require('mongojs').connect('mongodb://nirav:8288@flame.mongohq.com:27097/nirav_restaurant', ['restaurant']);  

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/',function(req,res){
  db.restaurant.find().sort({"id":1}, function(err,restaurant){
    if(err || !restaurant)
      {
        console.log('some db error');
        //redirect to error page
      }  
    
    else
      {
        res.render('index',{title:'Home', list: restaurant});
      }  
  });
});


app.get('/:id([0-9]+)',function(req,res){
  var id=req.params.id;
  db.restaurant.find({"id": id},function(err,restaurant){
    if(err || !restaurant)
      {
        console.log('no result with id='+id);
        //redirect to error page
      }    
    else
      {
        res.render('detail',{title:'Detail', restaurant: restaurant});
      } 
  });
});

app.post('/:id([0-9]+)',function(req,res){
  var id=req.params.id;
  name=req.body.user,
  email=req.body.mail,
  comment=req.body.comment,
  d=new Date();
  
  var day=d.getDate();
  var month=d.getMonth()+1;
  var year=d.getFullYear();
  var cdate=day+"/"+month+"/"+year;

  db.restaurant.update({"id": id}, {$push:{comments:{"commenttext":comment, "commentdate":cdate, "commentby":name, "commentbymail":email}}}
    ,function(err,restaurant){
    if(err || !restaurant)
      {
        console.log('error submitting the comment'); 
        //redirect to error page      
      }    
    else
      {
        res.redirect('/'+id);
      }  
    });
});

app.get('/about', function(req,res){
  res.render('about',{title: 'About'});
});

app.listen(80);
