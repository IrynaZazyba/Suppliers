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
import Items from "./pages/item/ItemsOfCustomer";
import Category from "./pages/category/Category";
import {AuthContext} from "./context/authContext";

function App() {

    const {user, setUser} = useContext(AuthContext);
    const currentCustomerId = user && user.currentCustomerId ? user.currentCustomerId : 0;

    const renderProfile = () => {
        return <ProtectedComponent conditions={user} render={(() => {
            return <Profile/>
        })}/>
    };

    const renderCustomer = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN"} render={(() => {
            return <Customers/>
        })}/>
    };

    const renderItems = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN"
        || user.role === "ROLE_DISPATCHER" || user.role === "ROLE_LOGISTICS_SPECIALIST"} render={(() => {
            return <Items/>
        })}/>
    };

    const renderCategory = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN"
        || user.role === "ROLE_DISPATCHER" || user.role === "ROLE_LOGISTICS_SPECIALIST"} render={(() => {
            return <Category/>
        })}/>
    };

    return (
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path={`/customers/${currentCustomerId}/category`} render={renderCategory}/>/>
                <Route path={`/customers/${currentCustomerId}/item`} render={renderItems}/>/>
                <Route path={`/customers/${currentCustomerId}/profile`} render={renderProfile}/>/>
                <Route path={`/customers`} render={renderCustomer}/>
                <Route path={`/login`} component={Login}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
