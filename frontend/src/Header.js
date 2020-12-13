import React, {useContext} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import {AuthContext} from "./context/authContext";

function Header() {

    const {user, setUser} = useContext(AuthContext);
    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.
    getItem("currentCustomerId"): 0;
    const checkPermission = user && user.currentCustomerId;
    const isPermittedAndRoleAdmin = user && user.currentCustomerId && (user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN");

    function getClass(regexOfClass) {
        return window.location.pathname.match(regexOfClass) ? "active" : "";
    }

    const customersClass = window.location.pathname === "/customers" ? "active" : "";
    const warehousesClass = window.location.pathname.match(/.warehouses/) ? "active" : "";
    const usersClass = window.location.pathname.match(/.users/) ? "active" : "";
    const carsClass = window.location.pathname === "/cars" ? "active" : "";

    const profileClass = getClass(/.profile/);
    const categoryClass = getClass(/.category/);
    const itemClass = getClass(/.item/);
    const retailerClass = getClass(/.retailers/);
    const appClass = getClass(/.application/);
    const writeOffActClass = getClass(/.write-off-act/)
    const waybillClass = getClass(/.waybills/);

    const itemPermission = checkPermission && (user.role === "ROLE_DISPATCHER");
    const categoryPermission = checkPermission && (user.role === "ROLE_DIRECTOR");
    const writeOffActPermission = checkPermission && (user.role === "ROLE_DISPATCHER"
        || user.role === "ROLE_DIRECTOR" || user.role === "ROLE_DRIVER");

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" variant="dark" className="header">
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto navigation">
                    {checkPermission &&
                    <Nav.Link className={profileClass}
                              href={`/customers/${currentCustomerId}/profile`}>Profile
                    </Nav.Link>}
                    {isPermittedAndRoleAdmin &&
                    <Nav.Link className={usersClass} href={`/customers/${currentCustomerId}/users`}>Users</Nav.Link>}
                    {checkPermission && (user.role === "ROLE_DISPATCHER" || user.role === "ROLE_LOGISTICS_SPECIALIST") &&
                    <Nav.Link className={appClass}
                              href={`/customers/${currentCustomerId}/application`}>Application</Nav.Link>}
                    {checkPermission && user.role === "ROLE_DISPATCHER" &&
                    <Nav.Link className={warehousesClass}
                              href={`/customers/${currentCustomerId}/warehouses`}>Warehouses
                    </Nav.Link>}
                    {isPermittedAndRoleAdmin &&
                    <Nav.Link className={usersClass} href="/users">Users</Nav.Link>}
                    {categoryPermission &&
                    <Nav.Link className={categoryClass}
                              href={`/customers/${currentCustomerId}/category`}>
                        Categories
                    </Nav.Link>}
                    {checkPermission && (user.role === "ROLE_LOGISTICS_SPECIALIST" || user.role === "ROLE_DRIVER") &&
                    <Nav.Link className={waybillClass}
                              href={`/customers/${user.currentCustomerId}/waybills`}>Waybills
                    </Nav.Link>}
                    {itemPermission &&
                    <Nav.Link className={itemClass}
                              href={`/customers/${currentCustomerId}/item`}>Items
                    </Nav.Link>}
                    {isPermittedAndRoleAdmin &&
                    <Nav.Link className={retailerClass}
                              href={`/customers/${currentCustomerId}/retailers`}>Retailers
                    </Nav.Link>}
                    {writeOffActPermission &&
                    <Nav.Link className={writeOffActClass}
                              href={`/customers/${user.currentCustomerId}/write-off-act`}>Write-off acts
                    </Nav.Link>}
                    {checkPermission && user.role === "ROLE_ADMIN" &&
                    <Nav.Link className={carsClass} href="/cars">Cars</Nav.Link>}
                    {checkPermission && user.role === "ROLE_SYSTEM_ADMIN" &&
                    <Nav.Link className={customersClass} href="/customers">Customers</Nav.Link>}
                    <UserProfile/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Header
