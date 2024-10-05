const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');
const port = 3001;

//Routers
const bookRouter = require('./routes/Books');
app.use("/books", bookRouter);

const authorsRouter = require('./routes/Authors');
app.use("/authors", authorsRouter);

const genresRouter = require('./routes/Genres');
app.use("/genres", genresRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log('Server running on port 3001.');
    });
});