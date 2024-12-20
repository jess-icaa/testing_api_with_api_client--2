const express = require('express');
// const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.json());

app.use(express.json());

const booksRoutes = require('./routes.books.js');
app.use('/books', booksRoutes);


app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});