const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, conn) => {
    if (err) {
        return console.log ('Unable to connect to MongoDB server');
    }
    console.log ('Connected to MongoDB server');

    const db = conn.db('test');
    db.collection('Todos').insertOne({
        text: 'something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log ('Unable to insert to Todos', err);
        }
        console.log (JSON.stringify (result.ops, undefined, 2));
    })

    db.collection('Users').insertOne({
        name: 'Santanu Lahiri',
        age: 100,
        location: 'Cloud 1'
    }, (err, result) => {
        if (err) {
            return console.log ('Unable to insert to Users', err);
        }
        //console.log (JSON.stringify (result.ops, undefined, 2));
        console.log (JSON.stringify (result.ops[0]._id.getTimestamp()));
    })

    conn.close();
});