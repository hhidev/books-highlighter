import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IUser } from '../store/modules/user';
import * as firebase from 'firebase';
import 'firebase/auth';

interface Props {
  user: IUser;
}

const Header: React.FunctionComponent<Props> = props => {
  const navEndItem = () => {
    if (props.user.uid) {
      return (
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link">{props.user.displayName}</a>
          <div className="navbar-dropdown is-right">
            <a className="navbar-item">マイページ</a>
            <hr className="navbar-divider" />
            <a className="navbar-item" onClick={logout}>
              ログアウト
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="navbar-item">
          <Link className="button is-primary" to={'/login'}>
            ログイン
          </Link>
        </div>
      );
    }
  };

  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem('current_user_id');
        window.location.href = '/';
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <h1>BooksHighlighter</h1>
        </a>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">{navEndItem()}</div>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Header);
