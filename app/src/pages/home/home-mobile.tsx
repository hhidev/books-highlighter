import * as React from 'react';
import Header from '../../components/header';
import { IUser } from '../../store/modules/user';
import { Book, BookCard } from '../../pages/home';
import Highlight from './highlight';
import InputModalMobile from './input-modal-mobile';

interface Props {
  bookList: Array<Book>;
  user: IUser;
  shelfId: string;
}

const HomeMobile: React.FunctionComponent<Props> = props => {
  const [selectedBook, setSelectedBook] = React.useState<Book>(null);

  return (
    <React.Fragment>
      {!selectedBook && (
        <React.Fragment>
          <Header />
          <div className={'container is-fluid is-marginless'}>
            <div className={'section'}>
              <InputModalMobile shelfId={props.shelfId} uid={props.user.uid} />
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
                            src={
                              book.imageUrl
                                ? book.imageUrl
                                : 'https://bulma.io/images/placeholders/128x128.png'
                            }
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
