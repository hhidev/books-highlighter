import * as React from 'react';
import Header from '../components/header';
import { storage, firebaseApp } from '../firebase';
import { connect } from 'react-redux';
import { IUser, userActions } from '../store/modules/user';
import { Dispatch } from 'redux';

interface Props {
  user: IUser;
  setCurrentUser: (user: firebase.UserInfo) => void;
}

const Home: React.FunctionComponent<Props> = props => {
  const [detectiveResult, setResult] = React.useState('');

  React.useEffect(() => {
    if (!props.user.uid) {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) {
          props.setCurrentUser(user);
        }
      });
    }
  }, []);

  const upload = e => {
    const file = e.target.files[0];
    const storageRef = storage.ref(file.name);
    const meta = {
      customMetadata: { owner: props.user.uid }
    };

    storageRef
      .put(file, meta)
      .then(result => {
        console.log(result.state);
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
        <pre>{JSON.stringify(detectiveResult, null, 2)}</pre>
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
