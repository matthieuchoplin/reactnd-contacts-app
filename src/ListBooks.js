import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import Book from "./Book";
import * as BooksAPI from "./BooksAPI";

class ListBooks extends Component {
  static propTypes = {
    myBooks: PropTypes.array.isRequired
  };
  state = {
    query: "",
    books: []
  };
  updateQuery = (query, myBooks) => {
    if (query.trim()) {
      this.setState({query: query});
      BooksAPI.search(query, 20).then((returnedBooks) => {
          if (!returnedBooks.error && this.state.query===query) {
            const booksWithShelves = this.addShelfToBooksFromApi(
              returnedBooks, myBooks
            );
            this.setState({
              books: booksWithShelves
            })
          }
          else{
            this.setState({
              books: []
            })
          }
        }
      )
    }
    else{
      this.setState({
        query: "",
        books: []
      })
    }
  };

  addShelfToBooksFromApi(returnedBooks, myBooks) {
    return returnedBooks.map(book => {
      book.shelf = "none";
      myBooks.forEach(myBook => {
        if (book.id === myBook.id) {
          book.shelf = myBook.shelf;
        }
      });
      return book;
    });
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={this.state.query}
                    onChange={event => this.updateQuery(event.target.value, this.props.myBooks)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {this.state.books.map(book => (
                    <li key={book.id}>
                      <Book
                        book={book}
                        onChangeShelf={(bookId, e) =>
                          this.props.onChangeShelf(bookId, e)
                        }
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default ListBooks;
