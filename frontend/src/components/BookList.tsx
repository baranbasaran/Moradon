import React from "react";
import { Book } from "../api/types";
import { Link } from "react-router-dom";

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No books found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Link
          key={book.id}
          to={`/books/${book.id}`}
          className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-start space-x-4">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 dark:text-white truncate">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {book.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                ${book.price.toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookList;
