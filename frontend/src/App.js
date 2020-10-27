import React,{useState} from 'react';
import './App.css';
import UserContext from './UserContext';
import Header from './Header';
import Footer from './Footer';
import Home from './MainPage/Home'
import {Route, Switch} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    return (
        
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/home' component={Home}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
