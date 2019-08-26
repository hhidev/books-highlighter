import * as React from 'react';
import { Redirect } from 'react-router';
import { auth } from '../firebase';

const Auth = props => {
  return auth.currentUser || localStorage.getItem('current_user_id') ? (
    props.children
  ) : (
    <Redirect to={'/'} />
  );
};

export default Auth;
