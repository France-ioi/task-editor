import 'babel-polyfill';
import './common/jsoneditor/init'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas'
import reducers from './reducers';
import Layout from './components/layout';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas)

const render = (Component) => {
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        document.getElementById('reactbody')
    );
};

render(Layout);