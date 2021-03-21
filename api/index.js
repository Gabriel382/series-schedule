/*
 * API para manutenção de um arquivo no formato JSON
 */

const http = require('http')

const handleget = require('./handleGET')
const handlepost = require('./handlePOST')
const handlepatch = require('./handlePATCH')

// instanciação de um servidor escutando na porta 300
http.createServer((req, res) => {
    
    switch (req.method) {
        case 'GET':
            console.log('method GET');
            return handleget(req, res)

        case 'POST':
            console.log('method POST');
            return handlepost(req, res)

        case 'PATCH':
            console.log('method PATCH');
            return handlepatch(req, res)

        case 'OPTIONS': // para métodos sujeitos às restrições CORS
            console.log('method OPTIONS');
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH',
                'Access-Control-Allow-Headers': 
                'access-control-allow-methods, access-control-allow-origin, content-type'
            })
            return res.end('OPTIONS OK')
        default:
            console.log(`Sorry, we dont work with ${req.method} method.`);
            res.statusCode = '404'
            res.end(JSON.stringify({ message: "Invalid HTTP method" }))
    }

}).listen(3000, () => console.log('Api is running on port 3000'))