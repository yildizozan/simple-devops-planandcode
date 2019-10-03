import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

import './styles/index.css';

import App from './containers/app';
import registerServiceWorker from './registerServiceWorker';

import ReducerProject from './reducers/reducer.project';
import MiddlewareProject from './middlewares/middleware.project';


const initialState = {};
const store = createStore(ReducerProject, initialState, applyMiddleware(logger, thunk, MiddlewareProject));

export default ReactDOM.render(
    <Provider store={ store }>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={ App } />
                    <Redirect to="/404" />
                </Switch>
            </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
