const {MongoClient, ObjectID} = require('mongodb'); // using desctructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, conn) => {
    if (err) {
        return console.log ('Unable to connect to MongoDB server');
    }
    console.log ('Connected to MongoDB server');

    const db = conn.db('test');
    db.collection('Todos').find({$text: {$search:"4"}}).toArray().then((docs) => {
        //console.log (`ToDo-s count: ${docs.count()}`);
        console.log (JSON.stringify (docs, undefined, 2));
    }, (err) => {
        console.log ('unable to fetch todos', err);
    })

    conn.close();     // commented due to promise
});