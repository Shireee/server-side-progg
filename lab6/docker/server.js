const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = 8080;

// Create the server
const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end("404");
            return;
        }
    
        res.writeHead(200);
        res.end(data);
    });
});

// Start the server
server.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
});