import * as React from 'react';

const Setup: React.FunctionComponent = props => {
  return (
    <div className={'container is-fluid'}>
      <div className={'columns is-centered'}>
        <div className={'column is-half'}>
          <div className={'hero'}>
            <div className="hero-body">
              <div className="container has-text-centered">
                <h1 className="title">Welcome!</h1>
                <h2 className="subtitle">まず本棚を作りましょう</h2>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">本棚のタイトル</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="例) ビジネス関連"
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input type="radio" name="answer" />
                公開
              </label>
              <label className="radio">
                <input type="radio" name="answer" />
                非公開
              </label>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className={'button is-primary'}>登録する</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
