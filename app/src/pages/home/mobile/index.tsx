import * as React from 'react';
import Header from '../../../components/header';
import { IUser, userActions } from '../../../store/modules/user';
import { Book, BookCard } from '../pc';
import Highlight from '../highlight';
import InputModalMobile from './input-modal-mobile';
import { RouterProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { fetchList } from '../../../store/modules/book/actions';
import { Store } from '../../../store';

interface Props {
  user: IUser;
  bookList: Book[];
  fetchBooks: (uid: string, shelfId: string) => void;
}

const HomeMobile: React.FunctionComponent<Props & RouterProps> = props => {
  const shelfId = props.history.location.pathname.replace('/', '');
  const [selectedBook, setSelectedBook] = React.useState<Book>(null);

  React.useEffect(() => {
    props.fetchBooks(props.user.uid, shelfId);
  }, []);

  return (
    <React.Fragment>
      {!selectedBook && (
        <React.Fragment>
          <Header />
          <div className={'container is-fluid is-marginless'}>
            <div className={'section'}>
              <InputModalMobile shelfId={shelfId} uid={props.user.uid} />
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
              <Highlight bookId={selectedBook.id} user={props.user} />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  user: state.user,
  bookList: state.books
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCurrentUser: (user: IUser) => dispatch(userActions.loginSuccess(user)),
  fetchBooks: (uid: string, shelfId: string) =>
    fetchList(uid, shelfId)(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeMobile);
