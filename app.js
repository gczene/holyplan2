/*jslint node: true, nomen: true*/

'use strict';

// connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/grm');

// get modules
var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    tplshare = require('tplshare'),
    RedisStore = require('connect-redis')(express),
    flash = require('connect-flash');

// init application
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.hogan);
app.set('view engine', 'html');
// app.locals(config.locals);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('S3CRE7'));
app.use(express.session({ store: new RedisStore(), secret: 'SEKR37'}));
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// configure template sharing
tplshare.setPath(app.get('views'));
tplshare.setExtension(app.get('view engine'));

app.get('/', function(req, res) {
    res.send('alma');
});

if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// creare and start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
