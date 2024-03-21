const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require('node:fs');
const path = require('path')


const host = 'localhost';
const port = 3000;
const public = path.join(__dirname, 'public')

let workers = [];

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        workers[i] = cluster.fork();

        // Listen for messages from worker
        workers[i].on('message', function(message) {
            if (message.isFree !== undefined) {
                this.isFree = message.isFree;
            }
            console.log(`Master ${process.pid} received message from worker ${this.process.pid}`);
        });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        workers = workers.filter(w => w.process.pid !== worker.process.pid);
        if (workers.length === 0) {
            console.log('All workers have exited, server is stopping');
            process.exit(0);
        }
    });

    // Listen for SIGINT signal
    process.on('SIGINT', function() {
        console.log('Master is stopping, waiting for workers to finish');
        let interval = setInterval(() => {
            let allWorkersFree = workers.every(worker => worker.isFree);
            if (allWorkersFree) {
                clearInterval(interval);
                for(let i=0; i<workers.length; i++) {
                    workers[i].send('shutdown');
                }
            }
        }, 1000); // check every second
    });
} else {
    let isFree = true;

    // Send initial message to master
    process.send({isFree});

    const listener = function(req, res) {
        isFree = false;
        const url = decodeURIComponent(req.url); 
        const filePath = path.join(public, url);
        if (url === '/'){
            setTimeout(() => {
                res.writeHead(200, {'Content-type': 'text/html'});
                res.end('Hello, World!\n');
                saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
                isFree = true;
                process.send({isFree});
            }, 4000);
        } else {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) { // handle non-existing path
                    res.writeHead(404, {'Content-type': 'text/html'});
                    res.end('404\n');
                    saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
                    isFree = true;
                    process.send({isFree});
                } else {
                    const readStream = fs.createReadStream(filePath);
                    res.writeHead(200);
                    readStream.pipe(res);
                    readStream.on('end', () => {
                        saveLog(req.socket.remoteAddress, new Date(), url, res.statusCode);
                        isFree = true;
                        process.send({isFree});
                    });
                }
            });
        }
    };
    
    const server = http.createServer(listener);

    server.listen(port, host, () => {
        console.log(`Server listening on port: ${port}`);
    });

    console.log(`Worker ${process.pid} started`);

    // Ignore SIGINT signal
    process.on('SIGINT', function() {});

    process.on('message', function(message) {
        if (message === 'shutdown') {
            console.log(`Worker ${process.pid} is shutting down...`);
            server.close(() => {
                console.log(`Worker ${process.pid} has finished tasks and is now exiting`);
                process.exit(0);
            });
        }
    });
}



// Logging function 
function saveLog(ip, date, url, code){
    fs.writeFile('./log.txt', 
                JSON.stringify({ date: date, ip: ip, path: url, code: code}) + '\r\n',
                {flag: 'a+'}, 
                err => { err ? console.log(err) : console.log(`Logged: ${new Date()}`)})
}