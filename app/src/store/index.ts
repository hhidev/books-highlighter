import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import * as reducers from './modules';
import thunk from 'redux-thunk';
import { connectRouter, RouterState } from 'connected-react-router';
import { Book } from './modules/book/model';
import User from './modules/user/model';

export interface Store {
  user: User;
  books: Book[];
  router: RouterState;
}

const Index = history => {
  const rootReducer = combineReducers<Store>({
    router: connectRouter(history),
    ...reducers
  });

  if (process.env.NODE_ENV === 'production') {
    return createStore(rootReducer, applyMiddleware(thunk));
  } else if (process.env.NODE_ENV === 'development') {
    return createStore(rootReducer, applyMiddleware(logger, thunk));
  }
};

export default Index;
