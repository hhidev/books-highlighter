import { types } from './actions';
import { Book } from './model';

const BooksReducer = (state: Book[] = [], action: any) => {
  switch (action.type) {
    case types.FETCH_LIST_OK:
      return action.data;

    default:
      return state;
  }
};

export default BooksReducer;
