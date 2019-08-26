import * as React from 'react';
import Header from '../../components/header';
import { IUser, userActions } from '../../store/modules/user';
import { Book, BookCard } from '../../pages/home';
import Highlight from './highlight';

interface Props {
  bookList: Array<Book>;
  user: IUser;
}

const HomeMobile: React.FunctionComponent<Props> = props => {
  const [selectedBookId, setSelectedBookId] = React.useState('');

  return (
    <React.Fragment>
      <Header />
      {!selectedBookId && (
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
                    onClick={e => setSelectedBookId(book.id)}
                    isSelected={selectedBookId === book.id}
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
      )}

      {selectedBookId && (
        <div className={'container is-fluid is-marginless'}>
          <div className={'level is-marginless'}>
            <div className={'level-left'}>
              <div className="level-item">
                <p className="subtitle is-5">
                  <strong>{`書籍情報`}</strong>
                </p>
              </div>
              <div className="level-item" />
            </div>
          </div>
          <div className={'columns is-marginless'}>
            <div className={'column is-one-quarter'}>
              {selectedBookId && (
                <Highlight bookId={selectedBookId} user={props.user} />
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default HomeMobile;
