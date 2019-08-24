import * as React from 'react';
import Header from '../components/header';
import { storage, firebaseApp, db, functions } from '../firebase';
import { connect } from 'react-redux';
import { IUser, userActions } from '../store/modules/user';
import { Dispatch } from 'redux';
import { uuid } from '../utils/uuid-generator';
import { bool } from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { RouterProps } from 'react-router';
import Highlight from './home/highlight';
import Field from '../components/field';

interface Props {
  user: IUser;
  setCurrentUser: (user: firebase.UserInfo) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  amazonUrl: string;
}

const Home: React.FunctionComponent<Props & RouterProps> = props => {
  const shelfId = props.history.location.pathname.replace('/', '');
  // console.log(shelfId);

  const [detectiveResult, setResult] = React.useState('');
  const [uploadedFileName, setFileName] = React.useState('');
  const [isShowModal, setModalFlag] = React.useState(false);
  const [bookInfo, setBookInfo] = React.useState<Book>({
    id: '',
    title: '',
    author: '',
    category: '',
    imageUrl: '',
    amazonUrl: ''
  });
  const [bookList, setBookList] = React.useState<Array<Book>>([]);
  const [selectedBookId, setSelectedBookId] = React.useState('');

  React.useEffect(() => {
    if (props.user.uid) {
      db.collection('books')
        .where('uid', '==', props.user.uid)
        .where('shelfId', '==', shelfId)
        .get()
        .then(snapShot => {
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
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [props]);

  React.useEffect(() => {
    if (!props.user.uid) {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) {
          props.setCurrentUser(user);
        }
      });
    }
  }, []);

  // React.useEffect(() => {
  //   if (props.user.uid) {
  //     db.collection('images')
  //       .where('uid', '==', props.user.uid)
  //       .where('filePath', '==', uploadedFileName)
  //       .onSnapshot(snapShot => {
  //         console.log(snapShot.docs);
  //         if (!snapShot.empty) {
  //           setResult(snapShot.docs[0].data().text);
  //         }
  //       });
  //   }
  // }, [uploadedFileName]);

  // React.useEffect(() => {
  //   if (props.user.uid) {
  //     db.collection('books')
  //       .where('uid', '==', props.user.uid)
  //       .get()
  //       .then(snapShot => {
  //         console.log(snapShot);
  //         const bookList = [];
  //         if (!snapShot.empty) {
  //           snapShot.docs.forEach(doc => {
  //             bookList.push(doc.data());
  //           });
  //         }
  //         setBookList(bookList);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
  // }, [props.user]);

  const upload = e => {
    const file = e.target.files[0];
    const fileName = uuid();
    const storageRef = storage.ref(fileName);
    const meta = {
      customMetadata: { owner: props.user.uid }
    };

    storageRef
      .put(file, meta)
      .then(result => {
        console.log(result.state);
        setFileName(result.metadata.name);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const submitBookInfo = async () => {
    await db
      .collection('books')
      .doc()
      .set(bookInfo)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
    setModalFlag(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  return (
    <React.Fragment>
      <Header />
      {/*<input type={'file'} title={'対象ファイル'} onChange={e => upload(e)} />*/}
      {/*<div>*/}
      {/*  <pre style={{ whiteSpace: 'pre-line' }}>*/}
      {/*    {JSON.stringify(detectiveResult, null, 2)}*/}
      {/*  </pre>*/}
      {/*</div>*/}
      {/*<button onClick={e => setModalFlag(true)}>書籍を登録する</button>*/}
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
            <a
              className={'button is-rounded is-fullwidth'}
              style={{ marginBottom: '1em' }}
              onClick={e => setModalFlag(true)}
            >
              書籍を追加する
            </a>
            {bookList.map((book, i) => {
              return (
                <div
                  className="card"
                  style={{
                    boxShadow: 'none',
                    borderBottom: 'solid 1px #e8e8e8',
                    backgroundColor: `${
                      selectedBookId === book.id ? 'beige' : ''
                    }`
                  }}
                  key={i}
                  onClick={e => setSelectedBookId(book.id)}
                >
                  <div className="card-image" style={{ padding: '1em' }}>
                    <figure
                      className="image is-128x128"
                      style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    >
                      <img
                        src={book.imageUrl}
                        alt="Placeholder image"
                        style={{ objectFit: 'contain', height: '100%' }}
                      />
                    </figure>
                  </div>
                  <div className="card-content" style={{ padding: '1em' }}>
                    <p className="title is-5">{book.title}</p>
                    <p className="subtitle is-6">{book.author}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={'column'}>
            {selectedBookId && (
              <Highlight bookId={selectedBookId} user={props.user} />
            )}
          </div>
        </div>
      </div>

      <div className={isShowModal ? 'modal is-active' : 'modal'}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">書籍を追加する</p>
            <button className="delete" onClick={e => setModalFlag(false)} />
          </header>
          <section className="modal-card-body">
            <Field
              label={'タイトル'}
              name={'title'}
              value={bookInfo.title}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'著者'}
              name={'author'}
              value={bookInfo.author}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'カテゴリ'}
              name={'category'}
              value={bookInfo.category}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'画像URL'}
              name={'imageUrl'}
              value={bookInfo.imageUrl}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'Amazonリンク'}
              name={'amazonUrl'}
              value={bookInfo.amazonUrl}
              onChangeHandler={handleInputChange}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={submitBookInfo}>
              Save
            </button>
            <button className="button" onClick={e => setModalFlag(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCurrentUser: (user: firebase.UserInfo) =>
    dispatch(userActions.loginSuccess(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
