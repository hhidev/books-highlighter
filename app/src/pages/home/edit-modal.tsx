import * as React from 'react';
import Field from '../../components/field';
import { db } from '../../firebase';
import { Book } from '../../store/modules/book/model';

interface Props {
  book: Book;
  setShowEditModal: (book: Book | null) => void;
}

const EditModal: React.FunctionComponent<Props> = props => {
  const [bookInfo, setBookInfo] = React.useState<Book>(props.book);
  const [isRequired, setRequired] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  const updateBookInfo = async () => {
    if (!bookInfo.title) {
      setRequired(true);
      return;
    }
    delete bookInfo.id;

    await db
      .collection('books')
      .doc(props.book.id)
      .set(bookInfo)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
    props.setShowEditModal(null);
  };

  return (
    <React.Fragment>
      <div className={props.book ? 'modal is-active' : 'modal'}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">書籍を編集する</p>
            <button
              className="delete"
              onClick={e => props.setShowEditModal(null)}
            />
          </header>
          <section className="modal-card-body">
            <Field
              label={'タイトル'}
              name={'title'}
              value={bookInfo.title}
              isError={isRequired}
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
          <footer
            className="modal-card-foot"
            style={{ justifyContent: 'flex-end' }}
          >
            <button
              className="button"
              onClick={e => props.setShowEditModal(null)}
            >
              キャンセル
            </button>
            <button className="button is-success" onClick={updateBookInfo}>
              更新
            </button>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditModal;
