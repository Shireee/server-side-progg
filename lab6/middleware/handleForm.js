const querystring = require('querystring');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Function for handling form data 
// and write it to cvs file

function handleForm(req, res) {
    let data = '';
    req.on('data', chunk => { data += chunk.toString() });
    req.on('end', () => {
        const body = querystring.parse(data);

        // validation
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (body.first_name == '') {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('<div class="error_message">You must enter your first name.</div>');
            return;
        }

        if (body.comments == '') {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('<div class="error_message">You must enter a comment.</div>');
            return
        }

        if (!regex.test(body.email)) {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('<div class="error_message">You must enter a valid email address.</div>');
            return;
        }
        // validation

        // csv writer
        const writer = csvWriter({
            path: 'data.csv',
            header: Object.keys(body).map(key => ({ id: key, title: key })),
            append: true
        });
        writer.writeRecords([body])
            .then(() => {
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.end("200");
            });
    });
}

module.exports = { handleForm };
