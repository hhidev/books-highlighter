import * as React from 'react';
import { Redirect } from 'react-router';

const Auth = props =>
  localStorage.access_token ? props.children : <Redirect to={'/login'} />;

export default Auth;
