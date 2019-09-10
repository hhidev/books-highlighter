import * as React from 'react';
import { Redirect } from 'react-router';
import { auth } from '../firebase';
import { Dispatch } from 'redux';
import { IUser, userActions } from '../store/modules/user';
import { connect } from 'react-redux';

interface Props {
  user: IUser;
  setCurrentUser: (user: IUser) => void;
}

const Auth: React.FunctionComponent<Props> = props => {
  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        props.setCurrentUser(user);
      }
    });
  }, []);

  if (!localStorage.getItem('current_user_id')) {
    return <Redirect to={'/'} />;
  }
  if (auth.currentUser) {
    return <>{props.children}</>;
  } else if (!props.user.uid) {
    return (
      <React.Fragment>
        <div>...loading</div>
      </React.Fragment>
    );
  }
  return <Redirect to={'/'} />;
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCurrentUser: (user: IUser) => dispatch(userActions.loginSuccess(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
