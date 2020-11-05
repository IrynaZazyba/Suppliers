import React from 'react';
import './App.css';
import UserContext from './UserContext';
import Header from './Header';
import Footer from './Footer';
import {Route, Switch} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedComponent from "./components/ProtectedComponent";

import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {

    return (
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path={'/profile'} render={() => {
                    return <ProtectedComponent render={(user => {
                        return <Profile/>
                    })}/>
                }}/>/>
                <Route path={'/login'} component={Login}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
