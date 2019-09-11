import * as React from 'react';
import Header from '../../../components/header';
import { IUser, userActions } from '../../../store/modules/user';
import Highlight from '../highlight';
import InputModalMobile from './input-modal-mobile';
import { RouterProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { fetchList } from '../../../store/modules/book/actions';
import { Store } from '../../../store';
import BookCard, { BookContext } from '../book-card';
import { Book } from '../../../store/modules/book/model';

interface Props {
  user: IUser;
  bookList: Book[];
  fetchBooks: (uid: string, shelfId: string) => void;
}

const HomeMobile: React.FunctionComponent<Props & RouterProps> = props => {
  const shelfId = props.history.location.pathname.replace('/', '');
  const [selectedBookId, setSelectedBookId] = React.useState('');

  React.useEffect(() => {
    props.fetchBooks(props.user.uid, shelfId);
  }, []);

  if (selectedBookId) {
    const selectedBook = props.bookList.filter(
      book => book.id === selectedBookId
    )[0];
    return (
      <div className={'container is-fluid is-marginless'}>
        <div className={'columns is-mobile is-marginless'}>
          <div className={'column is-one-quarter'}>
            <a onClick={e => setSelectedBookId(null)}>
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
    );
  }

  return (
    <BookContext.Provider value={{ selectedBookId }}>
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
                  key={i}
                  book={book}
                  setSelectedBookId={setSelectedBookId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </BookContext.Provider>
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
