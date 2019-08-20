import * as React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FunctionComponent = props => {
  return (
    <div>
      <h2>BooksHighlighter</h2>
      <Link to={'/login'}>ログイン</Link>
    </div>
  );
};

export default Header;
