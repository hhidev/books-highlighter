import * as React from 'react';
import Header from '../../../components/header';
import { connect } from 'react-redux';
import { IUser, userActions } from '../../../store/modules/user';
import { Dispatch } from 'redux';
import { RouterProps } from 'react-router';
import Highlight from '../highlight';
import InputModal from '../input-modal';
import EditModal from '../edit-modal';
import styled from 'styled-components';
import { fetchList } from '../../../store/modules/book/actions';
import { Store } from '../../../store';

interface Props {
  user: IUser;
  bookList: Book[];
  fetchBooks: (uid: string, shelfId: string) => void;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  amazonUrl: string;
  shelfId: string;
  uid: string;
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
    <React.Fragment>
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
                  className="card"
                  key={i}
                  onClick={e => setSelectedBookId(book.id)}
                  isSelected={selectedBookId === book.id}
                >
                  <div
                    className="card-image has-text-right"
                    style={{ padding: '1em' }}
                  >
                    <a
                      className={'has-text-grey-lighter'}
                      onClick={e => handleShowEditModal(book)}
                    >
                      <i className="fas fa-edit" />
                    </a>
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
          <div className={'column'} style={{ marginBottom: '80px' }}>
            <Highlight bookId={selectedBookId} user={props.user} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const BookCard = styled('div')<{ isSelected: boolean }>`
  box-shadow: none;
  border-bottom: solid 1px #e8e8e8;
  background-color: ${props => (props.isSelected ? 'beige' : '')};
`;

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
