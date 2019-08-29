import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styled from 'styled-components';
import { IUser, userActions } from '../store/modules/user';
import User from '../store/modules/user/model';
import { ThunkDispatch } from 'redux-thunk';
import { RouteComponentProps, RouterProps } from 'react-router';
import { firebaseApp, db, auth, GoogleAuthProvider } from '../firebase';
// import * as firebase from 'firebase/app';

interface Props extends RouteComponentProps {
  user: User;
}

interface Actions {
  loginSuccess: (data: IUser) => void;
}

const Login: React.FunctionComponent<Props & Actions & RouterProps> = props => {
  React.useEffect(() => {
    auth
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
    await firebaseApp.auth().signInWithRedirect(GoogleAuthProvider);
  };

  if (sessionStorage.getItem('signIn') === 'start') {
    return <div>loading...</div>;
  }
  return (
    <React.Fragment>
      <section className={'hero'} style={{ marginTop: '5rem' }}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 style={{ fontSize: '50px', fontWeight: 600, color: '#A8007A' }}>
              highlighter
            </h1>
            <p style={{ fontSize: '20px', color: '#A8007A' }}>
              本を紙で読む人向けのハイライトサービス
            </p>
          </div>
        </div>
      </section>
      <div className={'has-text-centered'} style={{ paddingTop: '80px' }}>
        <button className={'button is-rounded is-large'} onClick={e => login()}>
          googleアカウントでログイン
        </button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, void, Action>) => ({
  loginSuccess: (data: IUser) => dispatch(userActions.loginSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
