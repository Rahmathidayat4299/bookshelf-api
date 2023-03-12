/* eslint-disable linebreak-style */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

    // Jika nama tidak ada isinya. Status failed.
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'failed menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // Jika readPage > pageCount. Status failed.
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'failed menambahkan buku. halaman yang dibaca lebih besar dari halaman yang ada',
      });
      response.code(400);
      return response;
    }

    // Memasukkan data buku.
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
          };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    // Jika sukses memasukkan data
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    // jika failed karena alasan umum
    const response = h.response({
      status: 'error',
      message: 'Buku failed ditambahkan',
    });
    response.code(500);
    return response;
  };

  //get all data buku
  const getAllBookHandler = (request, h) => {
    const {
       name,
       reading,
       finished
      } = request.query;
  
    let filterBooks = books;
  
    if (name) {
      filterBooks = filterBooks.filter((book) => 
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    if (reading) {
      filterBooks = filterBooks.filter((book) => 
        book.reading == Number(reading)
      );
    }
  
    if (finished) {
      filterBooks = filterBooks.filter((book) => 
        book.finished == Number(finished)
      );
    }
  
    const response = h.response({
      status: 'success',
      data: {
        books: filterBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  
    response.code(200);
    return response;
  };
  
  //show book detail
  const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    // jika failed mengambil data dengan id
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
//edit book
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
  } = request.payload;

  if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'failed memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'failed memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'failed memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

//delete book id handler
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku failed dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

  module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
  };