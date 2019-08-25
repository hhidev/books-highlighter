import * as React from 'react';
import Field from '../../components/field';
import { db } from '../../firebase';

interface Props {
  shelfId: string;
  uid: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  amazonUrl: string;
  shelfId: string;
  uid: string;
}

const InputModal: React.FunctionComponent<Props> = props => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  const submitBookInfo = async () => {
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
        className={'button is-rounded is-fullwidth'}
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
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'著者'}
              name={'author'}
              value={bookInfo.author}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'カテゴリ'}
              name={'category'}
              value={bookInfo.category}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'画像URL'}
              name={'imageUrl'}
              value={bookInfo.imageUrl}
              onChangeHandler={handleInputChange}
            />
            <Field
              label={'Amazonリンク'}
              name={'amazonUrl'}
              value={bookInfo.amazonUrl}
              onChangeHandler={handleInputChange}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={submitBookInfo}>
              Save
            </button>
            <button className="button" onClick={e => setModalFlag(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InputModal;
