http = require('http')
const fs = require('node:fs');
const path = require('path')


host = 'localhost'
port = 3000

// Define static folder 
const public = path.join(__dirname, 'public')

// Logging function 
function saveLog(ip, date, url, code){
    fs.writeFile('./log.txt', 
                JSON.stringify({ date: date, ip: ip, path: url, code: code}) + '\r\n',
                {flag: 'a+'}, 
                err => { err ? console.log(err) : console.log(`Logged: ${new Date()}`)})
}

// Create a listener
const listener = function(req, res) {
    const url = decodeURIComponent(req.url); 
    const filePath = path.join(public, url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) { // handle non-existing path
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('404\n');
            saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
        } else {
            const readStream = fs.createReadStream(filePath);
            res.writeHead(200);
            readStream.pipe(res);
            saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
        }
    });
};

// Create a server instance 
const server = http.createServer(listener);

// Run server
server.listen(port, host, () => {
    console.log(`Servet listening on port: ${port}`)
})
