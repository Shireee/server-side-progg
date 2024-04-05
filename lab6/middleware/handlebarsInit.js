const fs = require('node:fs');
const path = require('path');
const handlebars = require('handlebars');


// Function witch accept path to partials folder,
// register all partials and create custom helper 'ifEquals'

function handlebarsInit(pathToPartials) {
    // Load hendlebars templates
    fs.readdir(pathToPartials, (err, files) => {
        if (err) { console.error('Error reading partials folder:', err); return}

        files.forEach(file => {
            if (!file.endsWith('.hbs')) return; // Skip non-handlebars files

            // Read partials data
            fs.readFile(path.join(pathToPartials, file), 'utf8', (err, partialData) => {
                if (err) { console.error('Error load part:', err); return}

                const partialName = path.parse(file).name; // getting partial name
                handlebars.registerPartial(partialName, partialData); // register partial
            });
        });
    });

    // regist custom handlebars helper
    handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
}

module.exports = { handlebarsInit };
