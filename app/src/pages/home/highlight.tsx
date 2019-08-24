import * as React from 'react';
import { db } from '../../firebase';
import styled from 'styled-components';
import { IUser } from '../../store/modules/user';

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
  // console.log(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
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

  React.useEffect(() => {
    console.log(props.bookId);
    if (props.bookId) {
      db.collection('images')
        .where('bookId', '==', props.bookId)
        .get()
        .then(snapShot => {
          if (!snapShot.empty) {
            const images = snapShot.docs.map(doc => doc.data() as Image);
            setImages(images);
          } else {
            setImages([]);
          }
        })
        .catch(error => {
          console.log(error);
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

export default Highlight;
