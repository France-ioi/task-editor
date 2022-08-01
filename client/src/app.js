import 'babel-polyfill';
import './libs/json_editor';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas'
import reducers from './reducers';
import App from './components/app';


var container_element = document.getElementById('reactbody')
var query = require('./libs/query')
var validation = query.validate()

if(!validation.valid) {
    container_element.innerHTML = validation.message
} else {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducers, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(sagas)
    
    const render = (Component) => {
        ReactDOM.render(
            <Provider store={store}>
                <Component />
            </Provider>,
            container_element
        );
    };
    
    render(App);
}