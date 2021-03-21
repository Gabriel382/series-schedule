/* Atualização do json com a lista de universidades */
const path = require('path')
const fs = require('fs')

function writefile(data, cb) {
    fs.writeFile(
        path.join(__dirname, "data","universidades.json"),
        JSON.stringify(data, null, 2),
        err => {
            if (err) throw err
            cb(JSON.stringify({ message: "ok" }))
        }
    )
}

module.exports = writefile