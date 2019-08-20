import * as React from 'react';
import Header from '../components/header';
import { storage } from '../firebase';

const Home: React.FunctionComponent = props => {
  const [detectiveResult, setResult] = React.useState('');

  const upload = e => {
    const file = e.target.files[0];
    const storageRef = storage.ref(file.name);
    // TODO UIDに変更
    const meta = {
      customMetadata: { owner: 'asdfghjkl' }
    };

    storageRef
      .put(file, meta)
      .then(result => {
        storageRef
          .getDownloadURL()
          .then(url => {
            console.log(url);
          })
          .catch(error => {
            console.log(error);
          });
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

export default Home;
