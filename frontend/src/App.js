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
import Warehouses from "./pages/warehouse/Warehouses";
import Application from "./pages/application/Application";

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

    const renderWarehouse = () => {
        return <ProtectedComponent conditions={user} render={(() => {
            return <Warehouses currentCustomerId={currentCustomerId}/>
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

    const renderApplication = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_LOGISTICS_SPECIALIST" ||
        user.role === "ROLE_DISPATCHER"} render={(() => {
            return <Application/>
        })}/>
    };

    function pathWithCustomer(urlAfterCustomer) {
        return `/customers/${currentCustomerId}${urlAfterCustomer}`
    }

    const categoryPath = pathWithCustomer(`/category`);
    const itemPath = pathWithCustomer(`/item`);
    const profilePath = pathWithCustomer(`/profile`);
    const applicationPath = pathWithCustomer(`/application`);

    return (
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path={'/customers/' + currentCustomerId + '/warehouses'} render={renderWarehouse}/>
                <Route path={'/customers/' + currentCustomerId + '/profile'} render={renderProfile}/>
                <Route path={'/customers/' + currentCustomerId + '/application'} render={renderApplication}/>
                <Route path={categoryPath} render={renderCategory}/>/>
                <Route path={itemPath} render={renderItems}/>/>
                <Route path={profilePath} render={renderProfile}/>/>
                <Route path={applicationPath} render={renderApplication}/>
                <Route path={'/customers'} render={renderCustomer}/>
                <Route path={'/login'} component={Login}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
