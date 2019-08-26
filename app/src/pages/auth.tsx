import * as React from 'react';
import { Redirect } from 'react-router';
import { firebaseApp } from '../firebase';

const Auth = props => {
  console.log(firebaseApp.auth().currentUser);
  return !firebaseApp.auth().currentUser ? (
    props.children
  ) : (
    <Redirect to={'/'} />
  );
  // localStorage.access_token ? props.children : <Redirect to={'/'} />;
};

export default Auth;
