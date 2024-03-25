const http = require('http');
const fs = require('node:fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const path = require('path');
const { saveLog } = require('./middleware/logger'); 
require('dotenv').config()


const public = path.join(__dirname, 'public')
let workers = [];

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) workers[i] = cluster.fork();

    // set 'exit' eventListener 
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

    // Listen for SIGINT signal
    process.on('SIGINT', () => {
        console.log('SIGINT -> waiting for workers to finish tasks...');
        workers.map((worker) => {
            worker.send('shutdown');
        });
    });
} else {
    // Check idle time
    let isFree = null;
    let lastRequestTime = Date.now();
    const checkIdleTime = (lastRequestTime) => {
        const idleTime = Date.now() - lastRequestTime;
        if (idleTime >= process.env.TIME_TO_CLOSE || isFree === null) isFree = true;
    }

    setInterval(() => {
        checkIdleTime(lastRequestTime);
    }, 1000); 

    // Worker
    console.log(`Worker ${process.pid} started`);

    const server = http.createServer( (req, res) => {
        const url = decodeURIComponent(req.url); 
        const filePath = path.join(public, url);

        if (url === '/'){
                res.writeHead(403, {'Content-type': 'text/html'});
                res.end('Forbidden!\n');
                saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
                
                // set request time
                isFree = false
                lastRequestTime = Date.now();
        } else {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) { 
                    res.writeHead(404, {'Content-type': 'text/html'});
                    res.end('404\n');
                    saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);

                    // set request time
                    isFree = false
                    lastRequestTime = Date.now();
                } else {
                    const readStream = fs.createReadStream(filePath);
                    res.writeHead(200);
                    readStream.pipe(res);
                    readStream.on('end', () => {
                        saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);

                        // set request time
                        isFree = false
                        lastRequestTime = Date.now();
                    });
                }
            });
        }
    });

    server.listen(process.env.PORT, process.env.HOST, () => {
        console.log(`Server listening on port: ${process.env.PORT}`);
    });

    process.on('SIGINT', () => {})
    process.on('message', (message) => {
        if (message === 'shutdown') {
            setInterval(() => {
                if (isFree) process.exit(0)
            }, 1000);
        }
    });
}

//  for i in {1..100}; do    curl http://localhost:3000/CSS Zen Garden_ The Beauty of CSS Design.html  & done
