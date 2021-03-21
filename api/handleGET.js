const URL = require('url')
const data = require('./data/universidades.json')
const writeFile = require('./writefile.js')

import './database';

function handleGET(req, res) {

    const { sigla, nome, url } = URL.parse(req.url, true).query
    const recurso = URL.parse(req.url, false).pathname

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    })

    /*
     * Na versão original, todas as requisições eram GETs.
     * Com GETs e POSTs, não haverá problema com o modo CORS
     * para os métodos PATH, PUT, etc. 
     *   
     * Conservei as alternativas, caso você queira fazer
     * como exercício, mas na versão atual, apenas o 
     * case("/list") é executado 
     *  
     */
    switch (recurso) {
        case ("/list"):
            return res.end(JSON.stringify(data)) // envia os dados no formato JSON

        case ("/delete"):
            data.universidades = data.universidades.filter(item => String(item.sigla) !== String(sigla))
            return writeFile(data, (message) => res.end(message))

        case ("/insert"):
            data.universidades.push({ sigla, nome, url })
            return writeFile(data, (message) => res.end(message))

        case ("/favicon.ico"):
            if (req.url !== '/favicon.ico')
                return writeFile(data, (message) => res.end(message))

        default:
            res.statusCode('404')
            return res.end()
    }
}
module.exports = handleGET