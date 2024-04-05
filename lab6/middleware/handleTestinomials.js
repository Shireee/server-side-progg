const { postTestimonials } = require('../dependencies/db.js');
const querystring = require('querystring');

function handleTestinomials(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        const { name, img_url, ocupation, title, description } = querystring.parse(body);
        postTestimonials(name, img_url, ocupation, title, description)
            .then(() => {
                console.log("Data inserted successfully");
            })
            .catch(error => {
                console.log("Data insert error");
            });
    });
}

module.exports = { handleTestinomials };