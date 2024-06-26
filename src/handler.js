import { nanoid } from "nanoid";
import {books} from "./books.js";

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
        
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

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
    }else{
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        });
        response.code(500);
        return response;
    
    }
};


const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
  
    // If the client asks for books based on name
    if (name) {
      // Hold the name
      const nameSearched = name.toLowerCase();
      // Filter the books
      const bookList = books
        .filter((book) => book.name.toLowerCase().includes(nameSearched))
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      // Return the bookList as the desired data
      const response = h.response(
        {
          status: 'success',
          data:
          {
            books: bookList,
          },
        },
      );
      response.code(200);
      return response;
    }
  
    // If the client asks for books based on reading status
    if (reading) {
      // Filter the books
      const bookList = books
        .filter((book) => book.reading === (reading === '1'))
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      // Return the bookList as the desired data
      const response = h.response(
        {
          status: 'success',
          data:
          {
            books: bookList,
          },
        },
      );
      response.code(200);
      return response;
    }
  
    // If the client asks for books based on finished status
    if (finished) {
      // Filter the books
      const bookList = books
        .filter((book) => book.finished === (finished === '1'))
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      // Return the bookList as the desired data
      const response = h.response(
        {
          status: 'success',
          data:
          {
            books: bookList,
          },
        },
      );
      response.code(200);
      return response;
    }
  
    // Else, assuming the client wants all books
    const response = h.response(
      {
        status: 'success',
        data:
        {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      },
    );
    response.code(200);
    return response;
  };
  

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];
    
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            });
            response.code(400);
            return response;
        }else if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            });
            response.code(400);
            return response;
        }
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
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    
    }else{
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }
}
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
    
}

export { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};