import * as React from 'react';
import { db } from '../../firebase';
import { Color, ColorButton, HighlightText } from './highlight';

interface Props {
  highlight: HighlightText;
  setShowModal: (flag: boolean) => void;
  isShow: boolean;
}

const EditHighlightModal: React.FunctionComponent<Props> = props => {
  const [highlight, setHighlight] = React.useState(props.highlight.text);
  const [highlightColor, setHighlightColor] = React.useState(Color.yellow);

  const submit = async () => {
    await db
      .collection('highlights')
      .add({
        bookId: props.highlight.bookId,
        text: highlight,
        uid: props.highlight.uid,
        color: highlightColor
      })
      .then(docRef => {
        console.log(docRef);
        props.setShowModal(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <div className={props.isShow ? 'modal is-active' : 'modal'}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">ハイライト</p>
            <button
              className="delete"
              onClick={e => props.setShowModal(false)}
            />
          </header>
          <section className="modal-card-body">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {Object.keys(Color).map((k, i) => {
                return (
                  <ColorButton
                    color={Color[k]}
                    onClick={e => setHighlightColor(Color[k])}
                    key={i}
                  >
                    <i
                      className={
                        highlightColor === Color[k]
                          ? 'fas fa-check'
                          : 'is-hidden'
                      }
                    />
                  </ColorButton>
                );
              })}
            </div>
            <textarea
              className={'textarea'}
              value={highlight}
              onChange={e => setHighlight(e.target.value)}
            />
          </section>
          <footer
            className="modal-card-foot"
            style={{ justifyContent: 'flex-end' }}
          >
            <button className="button" onClick={e => props.setShowModal(false)}>
              キャンセル
            </button>
            <button className="button is-success" onClick={e => submit()}>
              登録
            </button>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditHighlightModal;
