http = require('http')
const fs = require('node:fs');
const path = require('path')
var querystring = require("querystring");

host = 'localhost'
port = 3000
const public = path.join(__dirname, 'public')

const listener = function(req, res) {
    url = querystring.stringify(req.url)
    fs.access(public + url, fs.constants.F_OK, (err) => {
    if (err) {
        res.writeHead(404,{'Content-type': 'text/html'});
        res.end('404\n');

        log = {
            date: new Date(),
            ip: req.socket.remoteAddress,
            path: req.url,
            code: res.statusCode
        }
    
        saveLog(log)
    } else {
        const readStream = fs.createReadStream(public + url);
        res.writeHead(200,{'Content-type': 'text/html'});
        readStream.pipe(res);
    
        log = {
            date: new Date(),
            ip: req.socket.remoteAddress,
            path: req.url,
            code: res.statusCode
        }
    
        saveLog(log)
        }
    })
}

const server = http.createServer(listener);

server.listen(port, host, () => {
    console.log(`Servet listening on port: ${port}`)
})

// Logging function 
function saveLog(log){
    fs.writeFile('./log.txt', 
                JSON.stringify(log) + '\r\n',
                {flag: 'a+'}, 
                err => { err ? console.log(err) : console.log(`Logged: ${new Date()}`)})
}