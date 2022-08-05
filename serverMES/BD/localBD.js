// ******** Banco de dados embedded ********* /
var Datastore = require("nedb"),
    db = new Datastore({ filename: "./nedb", autoload: true });



/*
var doc = {
    hello: 'world'
    , n: 5
    , today: new Date()
    , nedbIsAwesome: true
    , notthere: null
    , notToBeSaved: undefined  // Will not be saved
    , fruits: ['apple', 'orange', 'pear']
    , infos: { name: 'nedb' }
};

db.insert(doc, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
});

db.find({}, function (err, docs) {
    console.log("resposta obtida: ", JSON.stringify(docs))
})


module.exports.db = db
*/

function gravaBD(dados) {




    db.insert(dados, function (err, newDoc) {
        console.log("dados gravados no BD: ", dados, " - Mensagem: ", newDoc)
    })


};

module.exports.gravaBD = gravaBD


function leBD() {
    return new Promise(
        function (resolve, reject) {

            db.find({}, function (err, docs) {
                console.log("Docs recebidos: ", docs)
                resolve(docs)
            })
        }

    )

}
module.exports.leBD = leBD