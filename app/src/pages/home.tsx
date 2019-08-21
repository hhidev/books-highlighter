import * as React from 'react';
import Header from '../components/header';
import { storage, firebaseApp, db, functions } from '../firebase';
import { connect } from 'react-redux';
import { IUser, userActions } from '../store/modules/user';
import { Dispatch } from 'redux';
import { uuid } from '../utils/uuid-generator';
import { bool } from 'prop-types';

interface Props {
  user: IUser;
  setCurrentUser: (user: firebase.UserInfo) => void;
}

interface Book {
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  amazonUrl: string;
}

const Home: React.FunctionComponent<Props> = props => {
  const [detectiveResult, setResult] = React.useState('');
  const [uploadedFileName, setFileName] = React.useState('');
  const [isShowModal, setModalFlag] = React.useState(false);
  const [bookInfo, setBookInfo] = React.useState<Book>({
    title: '',
    author: '',
    category: '',
    imageUrl: '',
    amazonUrl: ''
  });
  const [bookList, setBookList] = React.useState<Array<Book>>([]);

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
      db.collection('images')
        .where('uid', '==', props.user.uid)
        .where('filePath', '==', uploadedFileName)
        .onSnapshot(snapShot => {
          console.log(snapShot.docs);
          if (!snapShot.empty) {
            setResult(snapShot.docs[0].data().text);
          }
        });
    }
  }, [uploadedFileName]);

  React.useEffect(() => {
    if (props.user.uid) {
      db.collection('books')
        .where('uid', '==', props.user.uid)
        .get()
        .then(snapShot => {
          console.log(snapShot);
          const bookList = [];
          if (!snapShot.empty) {
            snapShot.docs.forEach(doc => {
              bookList.push(doc.data());
            });
          }
          setBookList(bookList);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [props.user]);

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
      <div className={'container is-fluid'}>
        <div className={'columns'}>
          <div className={'column is-one-quarter'}>
            {bookList.map((book, i) => {
              return (
                <div className="card" key={i}>
                  <div className="card-image">
                    <figure className="image is-128x128">
                      <img src={book.imageUrl} alt="Placeholder image" />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p className="title is-4">{book.title}</p>
                        <p className="subtitle is-6">{book.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={'column'} />
        </div>
      </div>

      <div className={isShowModal ? 'modal is-active' : 'modal'}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">書籍を登録する</p>
            <button
              className="delete"
              aria-label="close"
              onClick={e => setModalFlag(false)}
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">タイトル</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={bookInfo.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">著者</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="author"
                  value={bookInfo.author}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">カテゴリ</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="category"
                  value={bookInfo.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">画像Url</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="imageUrl"
                  value={bookInfo.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">amazonリンク</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="amazonUrl"
                  value={bookInfo.amazonUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
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
