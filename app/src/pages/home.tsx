import * as React from 'react';
import Header from '../components/header';
import { storage, firebaseApp, db } from '../firebase';
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

  return (
    <React.Fragment>
      <Header />
      <input type={'file'} title={'対象ファイル'} onChange={e => upload(e)} />
      <div>
        <pre style={{ whiteSpace: 'pre-line' }}>
          {JSON.stringify(detectiveResult, null, 2)}
        </pre>
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
