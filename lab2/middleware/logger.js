const fs = require('node:fs');

function saveLog(ip, date, url, code) {
    fs.writeFile('./log.txt', 
                JSON.stringify({ date: date, ip: ip, path: url, code: code}) + '\r\n',
                {flag: 'a+'}, 
                err => { err ? console.log(err) : console.log(`Logged: ${new Date()}`)});
}

module.exports = { saveLog };
