let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/kitty', { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('connected')
});


let kittySchema = new mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function () {
    let greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

let Kitten = mongoose.model('Kitten', kittySchema);

let fluffy = new Kitten({ name: 'fluffy'});
fluffy.speak();