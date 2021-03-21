const URL = require('url')
const writeFile = require('./writefile.js')
const univs = require('./data/universidades.json')

function handlePATCH(req, res) {
    const recurso = URL.parse(req.url, false).pathname

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    })

    if (String(recurso) === String("/patch")) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            univdel = JSON.parse(data)
            univs.universidades = univs.universidades.filter(item => String(item.sigla) !== String(univdel.sigla))
            return writeFile(univs, (message) => res.end(message))
        })
    } else {
        res.statusCode = '404'
        return res.end()
    }

    
}
module.exports = handlePATCH