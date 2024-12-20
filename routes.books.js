const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, './data.json');
// console.log('Data file path: ', dataFilePath);

const readBooksFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        console.log('Books data loaded from file:');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data.json', error);
        return [];
    }
};

const writeBooksToFile = (books) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2), 'utf-8');
        console.log('Books written to file successfully.');
    } catch (error) {
        console.error('Error writing to data.json:', error);
    }
};

// let books = readBooksFromFile();

router.post('/', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All fields are required: book_id, title, author, genre, year, copies.'});
    }

    const books = readBooksFromFile();

    if (books.find(book => book.book_id === book_id)) {
        return res.status(409).json({ error: 'Book with this ID already exists.'});
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    writeBooksToFile(books);
    res.status(201).json(newBook);
});

router.get('/', (req, res) => {
    const books = readBooksFromFile();
    console.log(books);
    res.json(books);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooksFromFile();
    // console.log('Books in file:',books);
    const book = books.find(book => book.book_id === id);
    // console.log('Looking for book with id:', id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    res.json(book);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, genre, year, copies } = req.body;
    const books = readBooksFromFile();
    const book = books.find(book => book.book_id === id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    } 

    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;

    writeBooksToFile(books);
    res.json(book);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooksFromFile();
    const bookIndex = books.findIndex(book => book.book_id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }


    books.splice(bookIndex, 1);
    writeBooksToFile(books);
    res.json({ message: 'Book deleted successfully.' });
});

module.exports = router;
