import * as React from 'react';
import { db, storage } from '../../firebase';
import styled from 'styled-components';
import { IUser } from '../../store/modules/user';
import { uuid } from '../../utils/uuid-generator';
import EditHighlightModal from './edit-highlight-modal';
import TabSwitcher, { TabPanel } from './tabs';

interface Props {
  bookId: string;
  user: IUser;
}

interface Image {
  id: string;
  bookId: string;
  filePath: string;
  text: string;
}

export interface HighlightText {
  text: string;
  color: string;
  uid: string;
  bookId: string;
}

interface PopMenuPosition {
  top: number;
  left: number;
  right: number;
}

const Highlight: React.FunctionComponent<Props> = props => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [images, setImages] = React.useState<Image[]>([]);
  // const [selectedTabName, setSelectTab] = React.useState('ハイライト');
  const [highlights, setHighlights] = React.useState<HighlightText[]>([]);
  const [selectedText, setSelectedText] = React.useState('');
  const [selectionRect, setSelectionRect] = React.useState<PopMenuPosition>({
    top: 0,
    left: 0,
    right: 0
  });
  const [uploadedFileNames, setFileNames] = React.useState([]);
  const [highlightColor, setHighlightColor] = React.useState(Color.yellow);
  const [isShowHighlightEdit, setHighlightModal] = React.useState(false);
  const [isShowNotify, setShowNotify] = React.useState(true);

  React.useEffect(() => {
    if (props.bookId) {
      db.collection('images')
        .where('bookId', '==', props.bookId)
        .onSnapshot(snapShot => {
          if (!snapShot.empty) {
            const images = snapShot.docs.map(doc => {
              const image = doc.data() as Image;
              image.id = doc.id;
              return image;
            });
            setImages(images);

            const currentUploads = uploadedFileNames.filter(
              n => !images.map(i => i.filePath).includes(n)
            );
            setFileNames(currentUploads);
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
        console.log(snapShot);
      });
  }, [props.bookId]);

  const showOnMenu = () => {
    if (window.getSelection().type === 'Range') {
      setSelectedText(window.getSelection().toString());
      const rect = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
      const positionY = rect.top + window.scrollY;

      setSelectionRect({
        top: positionY,
        left: rect.left,
        right: rect.right
      });
    } else {
      setSelectedText('');
      setSelectionRect({
        top: 0,
        left: 0,
        right: 0
      });
    }
  };

  const submit = async () => {
    await db
      .collection('highlights')
      .add({
        bookId: props.bookId,
        text: selectedText,
        uid: props.user.uid,
        color: highlightColor
      })
      .then(docRef => {
        console.log(docRef);
      })
      .catch(error => {
        console.log(error);
      });

    setSelectionRect({
      top: 0,
      left: 0,
      right: 0
    });
  };

  const showEditHighlightModal = () => {
    setHighlightModal(true);
    setSelectionRect({
      top: 0,
      left: 0,
      right: 0
    });
  };

  const upload = e => {
    // setSelectTab('解析済み');
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

  const deleteDetectText = async (id: string) => {
    await db
      .collection('images')
      .doc(id)
      .delete()
      .then()
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <TabSwitcher isMobile={isMobile}>
        <TabPanel tabName={'ハイライト'}>
          {highlights.map((highlight, i) => {
            return (
              <div
                key={i}
                style={{
                  marginBottom: '1em',
                  width: isMobile ? '100%' : '800px'
                }}
              >
                <HighlightContent color={highlight.color}>
                  {highlight.text}
                </HighlightContent>
              </div>
            );
          })}
        </TabPanel>
        <TabPanel tabName={'解析済み'}>
          {
            <React.Fragment>
              <div
                className={
                  uploadedFileNames.length === 0 && isShowNotify
                    ? 'notification is-primary'
                    : 'notification is-primary is-hidden'
                }
              >
                <button
                  className="delete"
                  onClick={e => setShowNotify(false)}
                />
                解析が終わるとこのタブに結果が表示されます。連続して画像アップロードできます。
                {!isMobile ? 'モバイルでアクセスするとカメラが使えます' : ''}
              </div>
              {images.map((image, i) => {
                return (
                  <div key={i} style={{ marginBottom: '1em' }}>
                    <pre onMouseUp={showOnMenu}>
                      {image.text}
                      <a
                        className={'button is-rounded is-danger'}
                        onClick={e => deleteDetectText(image.id)}
                      >
                        削除
                      </a>
                    </pre>
                  </div>
                );
              })}
            </React.Fragment>
          }
        </TabPanel>
      </TabSwitcher>

      <PopupMenu style={{ left: '0px', top: `${selectionRect.top - 35}px` }}>
        <ButtonContainer
          style={{
            transform: 'translateX(-33.9741%)',
            left: `${selectionRect.left}px`
          }}
        >
          {Object.keys(Color).map((k, i) => {
            return (
              <ColorButton
                color={Color[k]}
                onClick={e => setHighlightColor(Color[k])}
                key={i}
              >
                <i
                  className={
                    highlightColor === Color[k] ? 'fas fa-check' : 'is-hidden'
                  }
                />
              </ColorButton>
            );
          })}
          <a onClick={e => submit()}>ハイライト</a>
          <a onClick={e => showEditHighlightModal()}>編集</a>
        </ButtonContainer>
        <Triangle left={selectionRect.left} />
      </PopupMenu>

      {isShowHighlightEdit && (
        <EditHighlightModal
          isShow={isShowHighlightEdit}
          highlight={{
            bookId: props.bookId,
            text: selectedText,
            uid: props.user.uid,
            color: highlightColor
          }}
          setShowModal={setHighlightModal}
        />
      )}

      <CircleButton className={'button is-info'}>
        <i className="fas fa-camera" />
        <span>ページ読取</span>
        <input
          type={'file'}
          onChange={e => upload(e)}
          style={{ display: 'none' }}
        />
      </CircleButton>
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

export const ColorButton = styled('a')<{ color: string }>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const HighlightContent = styled('pre')<{ color: string }>`
  border-left: solid 4px ${props => props.color};
  background-color: white;
  white-space: normal;
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
  z-index: 2;
  > i {
    font-size: 2rem;
  }
  > span {
    font-size: 0.7rem;
  }
`;

export const Color = {
  yellow: '#F2E366',
  blue: '#A3C4FF',
  pink: '#FFC2F5'
};

export default Highlight;
