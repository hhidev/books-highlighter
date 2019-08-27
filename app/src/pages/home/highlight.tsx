import * as React from 'react';
import { db, storage } from '../../firebase';
import styled from 'styled-components';
import { IUser } from '../../store/modules/user';
import { uuid } from '../../utils/uuid-generator';

interface Props {
  bookId: string;
  user: IUser;
}

interface Image {
  bookId: string;
  downloadUrl: string;
  text: string;
}

interface HighlightText {
  text: string;
  color: string;
  uid: string;
  bookId: string;
}

const Highlight: React.FunctionComponent<Props> = props => {
  const [images, setImages] = React.useState<Image[]>([]);
  const [selectedTabName, setSelectTab] = React.useState('ハイライト');
  const [highlights, setHighlights] = React.useState<HighlightText[]>([]);
  const [selectedText, setSelectedText] = React.useState('');
  const [selectionRect, setSelectionRect] = React.useState<ClientRect>({
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  });
  const [uploadedFileNames, setFileNames] = React.useState([]);

  React.useEffect(() => {
    if (props.bookId) {
      db.collection('images')
        .where('bookId', '==', props.bookId)
        .onSnapshot(snapShot => {
          if (!snapShot.empty) {
            const images = snapShot.docs.map(doc => doc.data() as Image);
            setImages(images);
          } else {
            setImages([]);
          }
        });
    }
  }, [props.bookId]);

  React.useEffect(() => {
    // TODO 登録時間順に並び替えたい
    db.collection('highlights')
      .where('bookId', '==', props.bookId)
      .where('uid', '==', props.user.uid)
      .onSnapshot(snapShot => {
        if (!snapShot.empty) {
          const highlights = snapShot.docs.map(
            doc => doc.data() as HighlightText
          );
          setHighlights(highlights);
        } else {
          setHighlights([]);
        }
      });
  });

  const showOnMenu = () => {
    if (window.getSelection().type === 'Range') {
      setSelectedText(window.getSelection().toString());
      setSelectionRect(
        window
          .getSelection()
          .getRangeAt(0)
          .getBoundingClientRect()
      );
    } else {
      setSelectedText('');
      setSelectionRect({
        width: 0,
        height: 0,
        bottom: 0,
        top: 0,
        left: 0,
        right: 0
      });
    }

    console.log(window.getSelection().toString());
    console.log(
      window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect()
    );
  };

  const submit = async () => {
    await db
      .collection('highlights')
      .add({
        bookId: props.bookId,
        text: selectedText,
        uid: props.user.uid,
        color: 'yellow'
      })
      .then(docRef => {
        console.log(docRef);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const upload = e => {
    const file = e.target.files[0];
    const fileName = uuid();
    uploadedFileNames.push(fileName);
    setFileNames(uploadedFileNames);
    const storageRef = storage.ref(fileName);
    const meta = {
      customMetadata: { owner: props.user.uid, bookId: props.bookId }
    };

    storageRef
      .put(file, meta)
      .then(result => {
        console.log(result.state);
      })
      .catch(error => {
        console.log(error);
      });
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
              {images.length > 0 ? (
                <span className="tag is-rounded is-warning">
                  {images.length}
                </span>
              ) : (
                <span style={{ height: '2em' }} />
              )}
            </a>
          </li>
          <li className={selectedTabName === '画像読み取り' ? 'is-active' : ''}>
            <a onClick={e => setSelectTab('画像読み取り')}>
              画像読み取り
              <span style={{ height: '2em' }} />
            </a>
          </li>
        </ul>
      </div>

      {/*TODO スクロール量を加算する */}
      <PopupMenu style={{ left: '0px', top: `${selectionRect.top - 24}px` }}>
        <ButtonContainer
          style={{
            transform: 'translateX(-33.9741%)',
            left: `${selectionRect.left}px`
          }}
        >
          <ColorButton color={'yellow'} />
          <ColorButton color={'blue'} />
          <ColorButton color={'red'} />
          <a onClick={e => submit()}>ハイライト</a>
          <a>編集</a>
        </ButtonContainer>
        <Triangle left={selectionRect.left} />
      </PopupMenu>

      <CircleButton className={'button is-info'}>
        <i className="fas fa-camera" />
        <span>ページ読取</span>
        <input
          type={'file'}
          onChange={e => upload(e)}
          style={{ display: 'none' }}
        />
      </CircleButton>

      {selectedTabName === 'ハイライト' &&
        highlights.map((highlight, i) => {
          return (
            <div key={i} style={{ marginBottom: '1em' }}>
              <HighlightContent color={highlight.color}>
                {highlight.text}
              </HighlightContent>
            </div>
          );
        })}

      {selectedTabName === '未処理データ' &&
        images.map((image, i) => {
          return (
            <div key={i} style={{ marginBottom: '1em' }}>
              <pre onMouseUp={showOnMenu}>{image.text}</pre>
            </div>
          );
        })}

      {selectedTabName === '画像読み取り' && (
        <div>
          {uploadedFileNames.map(fileName => {
            return <div>{fileName}</div>;
          })}
        </div>
      )}
    </React.Fragment>
  );
};

const PopupMenu = styled('div')`
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 300;
  transform: translateY(calc(-100% - 24px));
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
`;

const ButtonContainer = styled('div')`
  position: relative;
  display: inline-block;
  width: 250px;
  text-align: center;
  background-color: #111;
  padding: 0 1px;
  border-radius: 4px;
  pointer-events: auto;
  padding: 0.7em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Triangle = styled('div')<{ left: number }>`
  left: ${props => props.left + 24}px;
  position: absolute;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid #111;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
`;

const ColorButton = styled('a')<{ color: string }>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const HighlightContent = styled('pre')<{ color: string }>`
  border-left: solid 4px ${props => props.color};
  background-color: white;
`;

const CircleButton = styled('label')`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  > i {
    font-size: 2rem;
  }
  > span {
    font-size: 0.7rem;
  }
`;

export default Highlight;
