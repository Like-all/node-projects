//#!/usr/bin/env node
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

var appEnv='';
switch(process.env.APPS_ENVIRONMENT) {
	case 'development':
		appEnv='dev';
		break;
	case 'testing':
		appEnv='test';
		break;
}
var socketPath=('/var/run/sockets/www-' + appEnv + '.it-the-drote.tk');


try {
    if(fs.statSync(socketPath)) {
        fs.unlinkSync(socketPath);
        console.log('Socket ' + socketPath +' exists! Removing...');
    }
} catch(err) {
    console.log('Everything is ok, starting Main website...');
}

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon('public/images/favicon.png'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/articles', routes.articles);
app.get('/dreams', routes.dreams);
app.get('/projects', routes.projects);
app.get('/article/:id', routes.article);
app.get('/dream/:id', routes.dream);
app.get('/project/:id', routes.project);
app.get('/about', routes.about);
app.get('/donate', routes.donate);
app.get('/cv', routes.cv);
app.get('/ping', routes.ping);

fs.writeFileSync('/tmp/it-the-drote.pid', process.pid);

http.createServer(app).listen(socketPath, function(){
  console.log('Express server listening on socket ' + socketPath);
  fs.chmodSync(socketPath, 0777);
});
