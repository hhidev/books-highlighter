import * as React from 'react';
import { db } from '../../firebase';

interface Props {
  bookId: string;
}

interface Image {
  bookId: string;
  downloadUrl: string;
  text: string;
}

const Highlight: React.FunctionComponent<Props> = props => {
  const [images, setImages] = React.useState<Image[]>([]);
  const [selectedTabName, setSelectTab] = React.useState('ハイライト');

  React.useEffect(() => {
    if (props.bookId) {
      db.collection('images')
        .where('bookId', '==', props.bookId)
        .get()
        .then(snapShot => {
          if (!snapShot.empty) {
            const images = snapShot.docs.map(doc => doc.data() as Image);
            setImages(images);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [props.bookId]);

  const showOnMenu = () => {
    console.log(window.getSelection().toString());
    console.log(
      window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect()
    );
  };

  return (
    <React.Fragment>
      <div className="tabs is-small">
        <ul>
          <li className={selectedTabName === 'ハイライト' ? 'is-active' : ''}>
            <a onClick={e => setSelectTab('ハイライト')}>
              ハイライト
              <span style={{ height: '2em' }} />
            </a>
          </li>
          <li className={selectedTabName === '未処理データ' ? 'is-active' : ''}>
            <a onClick={e => setSelectTab('未処理データ')}>
              未処理データ
              <span className="tag is-rounded is-warning">{images.length}</span>
            </a>
          </li>
        </ul>
      </div>
      {selectedTabName === '未処理データ' &&
        images.map((image, i) => {
          return (
            <div key={i} style={{ marginBottom: '1em' }}>
              <div className={'selection'}>
                <div>ハイライトする</div>
              </div>
              <pre onMouseUp={showOnMenu}>{image.text}</pre>
            </div>
          );
        })}
    </React.Fragment>
  );
};

export default Highlight;
