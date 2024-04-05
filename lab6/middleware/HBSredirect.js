const fs = require('node:fs');
const path = require('path');
const handlebars = require('handlebars');
const { getPotrfolio } = require('../dependencies/json-dependency.js');
const { getTestimonials } = require('../dependencies/db.js');
// Simple router for handlebars files

function HBSredirect(req, res, public) {
    switch(req.url) {
        case '/index.html':
            fs.readFile(path.join(public, 'index.hbs'), 'utf8', (err, data) => {
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
            fs.readFile(path.join(public, 'about-us.hbs'), 'utf8', (err, data) => {
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
            fs.readFile(path.join(public, 'services.hbs'), 'utf8', (err, data) => {
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
            fs.readFile(path.join(public, 'portfolio.hbs'), 'utf8', (err, data) => {
                if (err) throw err; 

                // dependecy on json-dependency.js
                getPotrfolio().then((json) => {
                    const template = handlebars.compile(data);
                
                    const context = {
                        header: 'Our Portfolio',
                        activeTab: 'portfolio',
                        item: json 
                    };
    
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                })
            });
            break;

        case '/features.html':
            fs.readFile(path.join(public, 'features.hbs'), 'utf8', (err, data) => {
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
            fs.readFile(path.join(public, 'testimonials.hbs'), 'utf8', (err, data) => {
                if (err) throw err; 
    
                getTestimonials().then(json => {
                    const template = handlebars.compile(data);
                    const context = {
                        header: 'Testimonials',
                        activeTab: 'testimonials',
                        item: json
                    };
    
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(template(context));
                }).catch(error => {
                    console.log('Error getting data from the database', error);
                });
            });
            break;

        case '/pricing.html':
            fs.readFile(path.join(public, 'pricing.hbs'), 'utf8', (err, data) => {
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
            fs.readFile(path.join(public, 'contact.hbs'), 'utf8', (err, data) => {
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
}

module.exports = { HBSredirect };
