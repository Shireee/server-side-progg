const http = require('http');

function getPotrfolio() {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:8080/', (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", (err) => {
            console.log("Error getPortfolio(): " + err.message);
            reject(err);
        });
    });
}

module.exports = { getPotrfolio };