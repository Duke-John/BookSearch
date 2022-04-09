
const mongoose = require('mongoose');

const url = "mongodb+srv://Suplex1702:Dukejohn90@cluster0.rnvgx.mongodb.net/BookSearch?retryWrites=true&w=majority";

const connectionParams={
    useNewUrlParser: true,

    useUnifiedTopology: true
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
