import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const rootReducer = combineReducers(reducers);
const composeEnhancers = composeWithDevToolsDevelopmentOnly({
  serialize: {
    options: {
      map: true,
    },
  },
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;

export default store;
