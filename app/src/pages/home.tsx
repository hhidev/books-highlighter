import * as React from 'react';
import Header from '../components/header';
import { storage, firebaseApp, db, functions } from '../firebase';
import { connect } from 'react-redux';
import { IUser, userActions } from '../store/modules/user';
import { Dispatch } from 'redux';
import { uuid } from '../utils/uuid-generator';

interface Props {
  user: IUser;
  setCurrentUser: (user: firebase.UserInfo) => void;
}

const Home: React.FunctionComponent<Props> = props => {
  const [detectiveResult, setResult] = React.useState('');
  const [uploadedFileName, setFileName] = React.useState('');

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

  const parseBookInfo = () => {
    const callable = functions.httpsCallable('scraping');
    callable({
      targetUrl:
        'https://www.amazon.co.jp/dp/B07ND6QTN4/?coliid=I2D2IAW24Q5VF8&colid=139TDX4P49ORP&psc=0&ref_=lv_ov_lig_dp_it'
    })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Header />
      <input type={'file'} title={'対象ファイル'} onChange={e => upload(e)} />
      <div>
        <pre style={{ whiteSpace: 'pre-line' }}>
          {JSON.stringify(detectiveResult, null, 2)}
        </pre>
      </div>
      <button onClick={parseBookInfo}>書籍情報を取得</button>
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
