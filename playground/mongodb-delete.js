const {MongoClient, ObjectID} = require('mongodb'); // using desctructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, conn) => {
    if (err) {
        return console.log ('Unable to connect to MongoDB server');
    }
    console.log ('Connected to MongoDB server');

    const db = conn.db('test');
    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({_id: new ObjectID("5a7a64d340730e620422c297")}).then((result) => {
        console.log (result);
    }, (err) => {
        console.log ('unable to delete todos', err);
    })

    conn.close();     // commented due to promise
});