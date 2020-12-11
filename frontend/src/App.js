import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import UserContext from './UserContext';
import Header from './Header';
import Footer from './Footer';
import {Route, Switch} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedComponent from "./components/ProtectedComponent";
import Users from "./pages/user/Users";
import Login from './pages/Login';
import Profile from './pages/Profile';
import Customers from "./pages/customer/Customers";
import Items from "./pages/item/ItemsOfCustomer";
import Category from "./pages/category/Category";
import {AuthContext} from "./context/authContext";
import Cars from "./pages/car/Cars";
import Warehouses from "./pages/warehouse/Warehouses";
import Application from "./pages/application/Application";
import WarehouseItems from "./pages/warehouse/WarehouseItems";
import WriteOffAct from "./pages/write-off/WriteOffPage";
import Waybill from "./pages/waybill/Waybill";

function App() {

    const {user, setUser} = useContext(AuthContext);
    const currentCustomerId = user && user.currentCustomerId ? user.currentCustomerId : 0;

    localStorage.setItem("currentCustomerId", currentCustomerId);

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
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN"
        || user.role === "ROLE_ADMIN"} render={(() => {
            return <Warehouses/>
        })}/>
    };

    const renderUser = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN"} render={(() => {
            return <Users/>
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
        || user.role === "ROLE_DIRECTOR"} render={(() => {
            return <Category/>
        })}/>
    };

    const renderApplication = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_LOGISTICS_SPECIALIST" ||
        user.role === "ROLE_DISPATCHER"} render={(() => {
            return <Application/>
        })}/>
    };

    const renderWarehouseItems = () => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN"
        || user.role === "ROLE_DISPATCHER"} render={(() => {
            return <WarehouseItems/>
        })}/>
    };

    const renderWriteOffActs =() => {
        return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN"
        || user.role === "ROLE_DISPATCHER" || user.role === "ROLE_DRIVER"
        || user.role === "ROLE_DIRECTOR"} render={(() => {
            return <WriteOffAct/>
        })}/>
    }

    const renderCar = () => {
       return <ProtectedComponent conditions={user.role === "ROLE_SYSTEM_ADMIN" | user.role === "ROLE_ADMIN"} render={(() => {
            return <Cars/>
        })}/>
    };

    const renderWaybill = () => {
        return <ProtectedComponent conditions={user} render={(() => {
            return <Waybill/>
        })}/>
    };


    function pathWithCustomer(urlAfterCustomer) {
        return `/customers/${currentCustomerId}${urlAfterCustomer}`
    }

    const categoryPath = pathWithCustomer(`/category`);
    const itemPath = pathWithCustomer(`/item`);
    const profilePath = pathWithCustomer(`/profile`);
    const applicationPath = pathWithCustomer(`/application`);
    const warehouseItemsPath = pathWithCustomer(`/warehouses/:warehouseId/items`);
    const writeOffPath = pathWithCustomer(`/write-off-act`);
    const waybillPath = pathWithCustomer(`/waybills`);

    return (
        <UserContext>
            <Header/>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path={warehouseItemsPath} render={renderWarehouseItems}/>
                <Route path={'/customers/' + currentCustomerId + '/warehouses'} render={renderWarehouse}/>
                <Route path={categoryPath} render={renderCategory}/>/>
                <Route path={itemPath} render={renderItems}/>/>
                <Route path={profilePath} render={renderProfile}/>/>
                <Route path={applicationPath} render={renderApplication}/>
                <Route path={writeOffPath} render={renderWriteOffActs}/>
                <Route path={waybillPath} render={renderWaybill}/>
                <Route path={'/customers'} render={renderCustomer}/>
                <Route path={'/users'} render={renderUser}/>
                <Route path={'/cars'} render={renderCar}/>
                <Route path={'/login'} component={Login}/>
            </Switch>
            <Footer/>
        </UserContext>
    )
}

export default App;
