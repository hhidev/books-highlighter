import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styled from 'styled-components';
import { userActions } from '../store/modules/user';
import User from '../store/modules/user/model';
import { ThunkDispatch } from 'redux-thunk';
import { RouteComponentProps, RouterProps } from 'react-router';
import { firebaseApp, db } from '../firebase';
import * as firebase from 'firebase/app';
import 'firebase/auth';

interface Props extends RouteComponentProps {
  user: User;
}

interface Actions {
  loginSuccess: (data: firebase.UserInfo) => void;
}

const Login: React.FunctionComponent<Props & Actions & RouterProps> = props => {
  React.useEffect(() => {
    firebaseApp
      .auth()
      .getRedirectResult()
      .then(async res => {
        if (res.credential) {
          props.loginSuccess(res.user);
          sessionStorage.removeItem('signIn');
          localStorage.setItem('current_user_id', res.user.uid);
          redirect(res.user.uid);
        }
      })
      .catch(error => {
        console.log(error);
        sessionStorage.removeItem('signIn');
      });
  }, []);

  const redirect = (uid: string) => {
    let path = '';
    db.collection('shelves')
      .where('uid', '==', uid)
      .get()
      .then(snapShot => {
        if (!snapShot.empty) {
          path = snapShot.docs[0].id;
          props.history.push(`/${path}`);
        } else {
          props.history.push('/setup');
        }
      })
      .catch(error => {
        console.log(error);
        props.history.push('/setup');
      });
  };

  const login = async () => {
    // firebaseからのリダイレクト時処理実行までに時間がかかり、loading中とするための設定
    sessionStorage.setItem('signIn', 'start');
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebaseApp.auth().signInWithRedirect(provider);
  };

  if (sessionStorage.getItem('signIn') === 'start') {
    return <div>loading...</div>;
  }
  return (
    <React.Fragment>
      <div style={{ paddingTop: '80px' }}>
        <InputBlock>
          <button
            className={'button is-primary'}
            style={{ width: '100%' }}
            color={'blue'}
            onClick={e => login()}
          >
            googleアカウントでログイン
          </button>
        </InputBlock>
      </div>
    </React.Fragment>
  );
};

export const InputBlock = styled.div`
  max-width: 530px;
  margin: 0 auto 40px;
  box-sizing: border-box;
  padding: 40px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  font-size: 16px;
  color: #999;
`;

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, void, Action>) => ({
  loginSuccess: (data: firebase.UserInfo) =>
    dispatch(userActions.loginSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
