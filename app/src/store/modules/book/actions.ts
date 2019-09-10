import { Dispatch } from 'redux';
import { db } from '../../../firebase';
import { Book } from './model';

export enum types {
  FETCH_LIST_OK = 'book/fetch/list/ok'
}

export const fetchListOK = (payload: Book[]) => ({
  type: types.FETCH_LIST_OK,
  data: payload
});

export const fetchList = (uid: string, shelfId: string) => (
  dispatch: Dispatch
) => {
  db.collection('books')
    .where('uid', '==', uid)
    .where('shelfId', '==', shelfId)
    .onSnapshot(snapShot => {
      if (!snapShot.empty) {
        const bookList = [];
        if (!snapShot.empty) {
          snapShot.docs.forEach(doc => {
            const book = doc.data() as Book;
            book.id = doc.id;
            bookList.push(book);
          });
        }
        dispatch(fetchListOK(bookList));
      }
    });
};
