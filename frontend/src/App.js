import React,{useState} from 'react';
import './App.css';
import UserContext from './UserContext';
import Header from './Header';
import Footer from './Footer';
import Home from './MainPage/Home'
import {Route, Switch} from "react-router-dom";


function App() {

    return (
        
        <UserContext>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                  integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                  crossOrigin="anonymous"/>
            <Header/>
            <Switch>
           
                <Route exact path='/home' component={Home}/>
           
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
