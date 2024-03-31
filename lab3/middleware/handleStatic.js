const fs = require('node:fs');
const path = require('path');

function handleStatic(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    fs.readFile(path.join(path.dirname(__dirname), 'public', decodeURIComponent(url.pathname)), (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end("404");
            return;
        }

        res.writeHead(200);
        res.end(data);
    });
}
module.exports = { handleStatic };
