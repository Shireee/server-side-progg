const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const host = 'localhost';
const port = 3000;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    const server = http.createServer((req, res) => {
        let result = 0;
        for (let i = 0; i < 1e10; i++) {
            result += i;
        }
        console.log(`Request handled by worker ${process.pid}`);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(`Hello from worker ${process.pid}\n`);
    });

    server.listen(port, host, () => {
        console.log(`Server listening on port: ${port}`);
    });

    console.log(`Worker ${process.pid} started`);
}