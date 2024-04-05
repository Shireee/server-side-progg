const http = require('http');
const path = require('path');
const { handleStatic } = require('./middleware/handleStatic'); 
const { handlebarsInit } = require('./middleware/handlebarsInit');
const { HBSredirect } = require('./middleware/HBSredirect');
const { handleContacts } = require('./middleware/handleContacts');
const { handleTestinomials } = require('./middleware/handleTestinomials.js');
require('dotenv').config()


const public = path.join(__dirname, 'public');
const pathToPartials = path.join(public, 'partials');


// Init handlebars 
handlebarsInit(pathToPartials);

const server = http.createServer( (req, res) => {
    // Router
    if (path.extname(req.url) === '.html') HBSredirect(req, res, public);
    else if (req.method === 'GET') handleStatic(req, res)
    else if (req.method === 'POST') {
        if (req.url === '/postTestimonials') {
            handleTestinomials(req, res);
        } else {
            handleContacts(req, res);
        }
    }
})

server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
})
