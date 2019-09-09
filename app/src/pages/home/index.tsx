import * as React from 'react';
import Header from '../../components/header';
import { firebaseApp, db } from '../../firebase';
import { connect } from 'react-redux';
import { IUser, userActions } from '../../store/modules/user';
import { Dispatch } from 'redux';
import { RouterProps } from 'react-router';
import Highlight from './highlight';
import InputModal from './input-modal';
import EditModal from './edit-modal';
import styled from 'styled-components';
import HomeMobile from './home-mobile';

interface Props {
  user: IUser;
  setCurrentUser: (user: IUser) => void;
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
  const [bookList, setBookList] = React.useState<Array<Book>>([]);
  const [selectedBookId, setSelectedBookId] = React.useState('');
  const [editTargetBook, setEditTargetBook] = React.useState<Book>(null);

  React.useEffect(() => {
    if (!props.user.uid) {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) {
          props.setCurrentUser(user);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (props.user.uid) {
      db.collection('books')
        .where('uid', '==', props.user.uid)
        .where('shelfId', '==', shelfId)
        .onSnapshot(snapShot => {
          if (!snapShot.empty) {
            const bookList = [];
            if (!snapShot.empty) {
              snapShot.docs.forEach(doc => {
                const book = doc.data() as Book;
                book.id = doc.id;
                bookList.push(book);
              });
            }
            setBookList(bookList);
          }
        });
    }
  }, [props]);

  // TODO 本棚情報を取得する

  const handleShowEditModal = (book: Book | null) => {
    setEditTargetBook(book);
  };

  if (!props.user.uid) {
    return (
      <React.Fragment>
        <div>...loading</div>
      </React.Fragment>
    );
  }

  // モバイルからのアクセスはモバイル版コンポーネントを返す
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return (
      <HomeMobile bookList={bookList} user={props.user} shelfId={shelfId} />
    );
  }

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

            {bookList.map((book, i) => {
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
            {selectedBookId && (
              <Highlight bookId={selectedBookId} user={props.user} />
            )}
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

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCurrentUser: (user: IUser) => dispatch(userActions.loginSuccess(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
