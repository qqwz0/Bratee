const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());

app.use('/covers', express.static(path.join(__dirname, 'covers')));
app.use('/pfps', express.static(path.join(__dirname, 'pfps')))

const db = require('./models');
const port = 3001;

//Routers
const bookRouter = require('./routes/Books');
app.use("/books", bookRouter);

const authorsRouter = require('./routes/Authors');
app.use("/authors", authorsRouter);

const genresRouter = require('./routes/Genres');
app.use("/genres", genresRouter);

const reviewsRouter = require('./routes/Reviews');
app.use("/reviews", reviewsRouter);

const usersRouter = require('./routes/Users');
app.use("/users", usersRouter);


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log('Server running on port 3001.');
    });
});
