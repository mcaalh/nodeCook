var http = require ('http');
var path = require ('path');
var fs = require('fs');

var mimeTypes= {
    '.js' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css'
};

var cache = {};
function cacheAndDeliver (f, cb){
    fs.stat(f, function(err, stats){
       if (err){return console.log('Oh noooo!, erreeur error');}
        var lastChanged = Date.parse(stats.ctime),
            isUpdated = (cache[f]) && lastChanged > cache[f].timeStamp;
        if (!cache[f] || isUpdated){
            fs.readFile(f, function(err, data){
                console.log('loading' + f + ' from cache');
                if (!err){
                    cache[f] = {content: data};
                }
                cb(err, data);
            });
            return;
        }
        cb(null, cache[f].content);
    });
}


var server = http.createServer(function(req, res){
    var lookup = path.basename (decodeURI(req.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function(exists){
       if (exists){
           cacheAndDeliver(f, function(err, data){
               if (err){
                   res.writeHead(500); res.end('Server error');
                   return;
               }
               var headers = {'Content-Type' : mimeTypes[path.extname(lookup)]};
               res.writeHead(200, headers);
               res.end(data);
           });
           return;
       }
        res.writeHead(404);
        res.end("page not found");
    });

});
server.listen(8000);