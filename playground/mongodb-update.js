const {MongoClient, ObjectID} = require('mongodb'); // using desctructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, conn) => {
    if (err) {
        return console.log ('Unable to connect to MongoDB server');
    }
    console.log ('Connected to MongoDB server');

    const db = conn.db('test');
    // findOneAndUpdate (filter, update, options, callback)
    // if no callback, returns a promise
    // update operators list on web
    // each parameter is a separate object.
    db.collection('Todos').findOneAndUpdate({
            _id: new ObjectID('5a7a44772cceeb12f4a1ea30')
        }, {
            $set: {
                completed: false,
                max: 20
            }
        }, {
            returnOriginal: false
        },
     ).then((result) => {
        console.log (result);
    }, (err) => {
        console.log ('unable to delete todos', err);
    })

    conn.close();     // commented due to promise
});