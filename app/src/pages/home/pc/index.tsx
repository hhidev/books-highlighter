import * as React from 'react';
import Header from '../../../components/header';
import { connect } from 'react-redux';
import { IUser, userActions } from '../../../store/modules/user';
import { Dispatch } from 'redux';
import { RouterProps } from 'react-router';
import Highlight from '../highlight';
import InputModal from '../input-modal';
import EditModal from '../edit-modal';
import { fetchList } from '../../../store/modules/book/actions';
import { Store } from '../../../store';
import { Book } from '../../../store/modules/book/model';
import BookCard, { BookContext } from '../book-card';

interface Props {
  user: IUser;
  bookList: Book[];
  fetchBooks: (uid: string, shelfId: string) => void;
}

const Home: React.FunctionComponent<Props & RouterProps> = props => {
  const shelfId = props.history.location.pathname.replace('/', '');
  const [selectedBookId, setSelectedBookId] = React.useState('');
  const [editTargetBook, setEditTargetBook] = React.useState<Book>(null);

  React.useEffect(() => {
    props.fetchBooks(props.user.uid, shelfId);
  }, []);

  // TODO 本棚情報を取得する

  const handleShowEditModal = (book: Book | null) => {
    setEditTargetBook(book);
  };

  return (
    <BookContext.Provider value={{ selectedBookId }}>
      <Header />
      <div className={'container is-fluid is-marginless'}>
        <div className={'columns is-marginless'}>
          <div className={'column is-one-quarter'}>
            {/*TODO trigger部分を明記*/}
            <InputModal shelfId={shelfId} uid={props.user.uid} />
            {editTargetBook && (
              <EditModal
                book={editTargetBook}
                setShowEditModal={handleShowEditModal}
              />
            )}

            {props.bookList.map((book, i) => {
              return (
                <BookCard
                  book={book}
                  setSelectedBookId={setSelectedBookId}
                  handleShowEditModal={handleShowEditModal}
                  key={i}
                />
              );
            })}
          </div>
          <div className={'column'} style={{ marginBottom: '80px' }}>
            <Highlight bookId={selectedBookId} user={props.user} />
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
)(Home);
