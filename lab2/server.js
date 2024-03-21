const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const host = 'localhost';
const port = 3000;

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
            console.log(`Master ${process.pid} received message from worker ${this.process.pid}: ${message}`);
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

    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    const server = http.createServer((req, res) => {
        isFree = false;
        let result = 0;
        for (let i = 0; i < 1e10; i++) {
            result += i;
        }
        console.log(`Request handled by worker ${process.pid}`);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(`Hello from worker ${process.pid}\n`, () => {
            isFree = true;
            process.send({isFree});
        });
    });

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