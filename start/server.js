var http = require ('http');
var path = require ('path');
var fs = require('fs');

var mimeTypes= {
    '.js' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css'
};

var server = http.createServer(function(req, res){
    var lookup = path.basename (decodeURI(req.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function(exists){
       if (exists){
           fs.readFile(f, function(err, data){
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
        res.end();
    });

});
server.listen(8000);