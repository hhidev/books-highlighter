import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import * as reducers from './modules';
import thunk from 'redux-thunk';
import { connectRouter } from 'connected-react-router';

const Index = history => {
  const rootReducer = combineReducers({
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
