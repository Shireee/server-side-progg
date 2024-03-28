const http = require('http');
const fs = require('node:fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config()


const publicFolder = path.join(__dirname, 'public');
const partialsFolder = path.join(publicFolder, 'partials');

// Load hendlebars templates
fs.readdir(partialsFolder, (err, files) => {
    if (err) {
        console.error('Error reading partials folder:', err);
        return;
    }

    files.forEach(file => {
        if (!file.endsWith('.hbs')) return; // Skip non-handlebars files

        // Read partials data
        fs.readFile(path.join(partialsFolder, file), 'utf8', (err, partialData) => {
            console.log(`Load ${partialName}`)
            const partialName = path.parse(file).name; // getting partial name
            handlebars.registerPartial(partialName, partialData); // register partial
        });
    });
});


const server = http.createServer( (req, res) => {
    const url = decodeURIComponent(req.url); 
    const filePath = path.join(publicFolder, url);
   
    switch(url) {
        case '/':
            res.writeHead(403, {'Content-type': 'text/html'});
            res.end('Forbidden!\n');

        case '/testimonials.html':
            fs.readFile(path.join(publicFolder, 'testimonials.hbs'), 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading home.hbs:', err);
                    return;
                }

                template = handlebars.compile(data);

                const context = {
                    title: 'Добро пожаловать',
                    body: 'Это пример использования Handlebars без Express'
                };

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(template(context));
            })

    }
})

server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
})


