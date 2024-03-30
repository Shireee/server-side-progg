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

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const server = http.createServer( (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = path.join(publicFolder, url.pathname);
    
    // redirect .hbs to .html 
    if (path.extname(url.pathname) === '.html') {
        filePath = path.join(__dirname, 'public',  path.basename(url.pathname, '.hbs') + '.html');
        switch(url.pathname) {
            case '/index.html':
                fs.readFile(path.join(publicFolder, 'index.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        activeTab: 'home'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;

            case '/about-us.html':
                fs.readFile(path.join(publicFolder, 'about-us.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'About Us',
                        activeTab: 'about'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;
            
            case '/services.html':
                fs.readFile(path.join(publicFolder, 'services.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Our Services',
                        activeTab: 'services'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;
                 
            case '/portfolio.html':
                fs.readFile(path.join(publicFolder, 'portfolio.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Our Portfolio',
                        activeTab: 'portfolio'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;

            case '/features.html':
                fs.readFile(path.join(publicFolder, 'features.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Features',
                        activeTab: 'features'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;

            case '/testimonials.html':
                fs.readFile(path.join(publicFolder, 'testimonials.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Testimonials',
                        activeTab: 'testimonials'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;

            case '/pricing.html':
                fs.readFile(path.join(publicFolder, 'pricing.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Pricing',
                        activeTab: 'pricing'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                });
                break;

            case '/contact.html':
                fs.readFile(path.join(publicFolder, 'contact.hbs'), 'utf8', (err, data) => {
                    if (err) throw err; 
        
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Pricing',
                        activeTab: 'contact'
                    };

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
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
