const http = require('http');
const fs = require('node:fs');
const path = require('path');
const handlebars = require('handlebars');
const { handleStatic } = require('./middleware/handeStatic'); 
require('dotenv').config()


const publicFolder = path.join(__dirname, 'public');
const partialsFolder = path.join(publicFolder, 'partials');

// Load hendlebars templates
fs.readdir(partialsFolder, (err, files) => {
    if (err) { console.error('Error reading partials folder:', err); return}

    files.forEach(file => {
        if (!file.endsWith('.hbs')) return; // Skip non-handlebars files

        // Read partials data
        fs.readFile(path.join(partialsFolder, file), 'utf8', (err, partialData) => {
            if (err) { console.error('Error load part:', err); return}

            const partialName = path.parse(file).name; // getting partial name
            handlebars.registerPartial(partialName, partialData); // register partial
            console.log(`${partialName} loaded`)
        });
    });
});


const server = http.createServer( (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = path.join(publicFolder, url.pathname);
    
    // redirect .hbs to .html 
    if (path.extname(url.pathname) === '.html') {
        filePath = path.join(__dirname, 'public',  path.basename(url.pathname, '.hbs') + '.html');
        switch(url.pathname) {
            case '/testimonials.html':
                fs.readFile(path.join(publicFolder, 'testimonials.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/services.html':
                fs.readFile(path.join(publicFolder, 'services.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/pricing.html':
                fs.readFile(path.join(publicFolder, 'pricing.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/portfolio.html':
                fs.readFile(path.join(publicFolder, 'portfolio.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/index.html':
                fs.readFile(path.join(publicFolder, 'index.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/features.html':
                fs.readFile(path.join(publicFolder, 'features.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/contact.html':
                fs.readFile(path.join(publicFolder, 'contact.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
            case '/about-us.html':
                fs.readFile(path.join(publicFolder, 'about-us.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
        
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template());
                });
                break;
        }        
    } else {
        handleStatic(req, res)
    }

})

server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
})
