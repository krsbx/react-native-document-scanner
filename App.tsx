import React from 'react';
import { Provider } from 'react-redux';

import Scanner from './src/components/Scanner';
import store from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <Scanner />
    </Provider>
  );
};

export default App;
