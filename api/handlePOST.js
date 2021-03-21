const URL = require('url')
const univs = require('./data/universidades.json')
const writeFile = require('./writefile.js')

function handlePOST(req, res) {

    const recurso = URL.parse(req.url, false).pathname

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    })

    if (String(recurso) === String("/insert")) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            univ = JSON.parse(data)
            univs.universidades.push(univ)
            return writeFile(univs, (message) => res.end(message))
        })
    } else {
        res.statusCode = '404'
        return res.end()
    }
}

module.exports = handlePOST