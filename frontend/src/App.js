import React, {useContext} from 'react';
import './App.css';
import UserContext from './UserContext';
import Header from './Header';
import Footer from './Footer';
import {Route, Switch} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedComponent from "./components/ProtectedComponent";

import Login from './pages/Login';
import Profile from './pages/Profile';
import Customers from "./pages/customer/Customers";
import {AuthContext} from "./context/authContext";

function App() {

    const {user, setUser} = useContext(AuthContext);
    const currentCustomerId = user && user.currentCustomerId ? user.currentCustomerId : 0;

    return (
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path={'/customers/' + currentCustomerId + '/profile'}
                       render={() => {
                           return <ProtectedComponent render={(user => {
                               return <Profile/>
                           })}/>
                       }}/>/>
                <Route path={'/customers'} render={() => {
                    return <ProtectedComponent render={(user => {
                        return user.role === "ROLE_SYSTEM_ADMIN" && <Customers/>
                    })}/>
                }}/>/>
                <Route path={'/login'} component={Login}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
