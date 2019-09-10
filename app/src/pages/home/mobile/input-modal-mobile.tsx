import * as React from 'react';
import Field from '../../../components/field';
import { db } from '../../../firebase';
import { Book } from '../pc';

interface Props {
  shelfId: string;
  uid: string;
}

const InputModalMobile: React.FunctionComponent<Props> = props => {
  const [isShowModal, setModalFlag] = React.useState(false);
  const [bookInfo, setBookInfo] = React.useState<Book>({
    id: '',
    title: '',
    author: '',
    category: '',
    imageUrl: '',
    amazonUrl: '',
    shelfId: props.shelfId,
    uid: props.uid
  });
  const [isRequired, setRequired] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  const submitBookInfo = async () => {
    if (!bookInfo.title) {
      setRequired(true);
      return;
    }
    await db
      .collection('books')
      .doc()
      .set(bookInfo)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
    setModalFlag(false);
  };

  return (
    <React.Fragment>
      <a
        className={'button is-rounded is-fullwidth has-text-weight-bold'}
        style={{ marginBottom: '1em' }}
        onClick={e => setModalFlag(true)}
      >
        書籍を追加する
      </a>
      <div className={isShowModal ? 'modal is-active' : 'modal'}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">書籍を追加する</p>
            <button className="delete" onClick={e => setModalFlag(false)} />
          </header>
          <section className="modal-card-body">
            <Field
              label={'タイトル'}
              name={'title'}
              value={bookInfo.title}
              isError={isRequired}
              onChangeHandler={handleInputChange}
            />
            <p>詳細な書籍情報はPC版で編集できます</p>
          </section>

          <footer
            className="modal-card-foot"
            style={{ justifyContent: 'flex-end' }}
          >
            <button className="button" onClick={e => setModalFlag(false)}>
              キャンセル
            </button>
            <button className="button is-success" onClick={submitBookInfo}>
              登録
            </button>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InputModalMobile;
