import * as React from 'react';
import Field from '../../../components/field';
import { db, functions } from '../../../firebase';
import { Book } from '../../../store/modules/book/model';

interface Props {
  shelfId: string;
  uid: string;
}

interface ParseResult {
  title: string;
  author: string;
  imageUrl: string;
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
    if (bookInfo.amazonUrl) {
      bookInfo.title = '解析中';
    }

    if (!bookInfo.title) {
      setRequired(true);
      return;
    }

    const bookId = await db
      .collection('books')
      .add(bookInfo)
      .then(result => {
        console.log(result);
        return result.id;
      })
      .catch(error => {
        console.log(error);
      });
    setModalFlag(false);

    if (bookInfo.amazonUrl && bookId) {
      const parseResult = await parseAmazonLink(bookInfo.amazonUrl);
      if (parseResult) {
        db.collection('books')
          .doc(bookId)
          .update(parseResult)
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const parseAmazonLink = async (url: string) => {
    const callable = functions.httpsCallable('scraping');
    const result = await callable({
      targetUrl: url
    })
      .then(result => {
        return result.data as ParseResult;
      })
      .catch(error => {
        console.log(error);
      });
    return result;
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
            <Field
              label={'Amazonリンクから書籍情報を登録'}
              name={'amazonUrl'}
              value={bookInfo.amazonUrl}
              onChangeHandler={handleInputChange}
            />
            {/*<p>詳細な書籍情報はPC版で編集できます</p>*/}
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
