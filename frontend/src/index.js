import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom";
import {BrowserRouter} from 'react-router-dom';
import AuthContextProvider from "./context/authContext";
import { Typeahead } from 'react-bootstrap-typeahead';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register();


ReactDOM.render((
    <BrowserRouter>
        <AuthContextProvider>
            <App/>
        </AuthContextProvider>
    </BrowserRouter>
), document.getElementById('root'));
