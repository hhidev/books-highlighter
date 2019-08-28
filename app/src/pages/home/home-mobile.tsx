import * as React from 'react';
import Header from '../../components/header';
import { IUser } from '../../store/modules/user';
import { Book, BookCard } from '../../pages/home';
import Highlight from './highlight';

interface Props {
  bookList: Array<Book>;
  user: IUser;
}

const HomeMobile: React.FunctionComponent<Props> = props => {
  const [selectedBook, setSelectedBook] = React.useState<Book>(null);

  return (
    <React.Fragment>
      {!selectedBook && (
        <React.Fragment>
          <Header />
          <div className={'container is-fluid is-marginless'}>
            <div className={'level is-marginless'}>
              <div className={'level-left'}>
                <div className="level-item">
                  <p className="subtitle is-5">
                    <strong>{`${props.user.displayName}の本棚`}</strong>
                  </p>
                </div>
                <div className="level-item" />
              </div>
            </div>
            <div className={'columns is-marginless'}>
              <div className={'column is-one-quarter'}>
                {props.bookList.map((book, i) => {
                  return (
                    <BookCard
                      className="card"
                      key={i}
                      onClick={e => setSelectedBook(book)}
                      isSelected={selectedBook === book}
                    >
                      <div className="card-image" style={{ padding: '1em' }}>
                        <figure
                          className="image is-128x128"
                          style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        >
                          <img
                            src={book.imageUrl}
                            style={{ objectFit: 'contain', height: '100%' }}
                          />
                        </figure>
                      </div>
                      <div className="card-content" style={{ padding: '1em' }}>
                        <p className="title is-5">{book.title}</p>
                        <p className="subtitle is-6">{book.author}</p>
                      </div>
                    </BookCard>
                  );
                })}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      {selectedBook && (
        <div className={'container is-fluid is-marginless'}>
          <div className={'columns is-mobile is-marginless'}>
            <div className={'column is-one-quarter'}>
              <a onClick={e => setSelectedBook(null)}>
                <i className="fas fa-arrow-left" />
              </a>
            </div>
            <div className={'column'} />
          </div>
          <div className={'has-text-centered'}>
            <strong>{selectedBook.title}</strong>
          </div>
          <div className={'columns is-marginless'}>
            <div
              className={'column is-one-quarter'}
              style={{ marginBottom: '80px' }}
            >
              {selectedBook && (
                <Highlight bookId={selectedBook.id} user={props.user} />
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default HomeMobile;
