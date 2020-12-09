import React, {useContext} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import {AuthContext} from "./context/authContext";

function Header() {

    const {user, setUser} = useContext(AuthContext);

    const checkPermission = user && user.currentCustomerId;
    const isPermittedAndRoleAdmin = user && user.currentCustomerId && (user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN");

    function getClass(regexOfClass) {
        return window.location.pathname.match(regexOfClass) ? "active" : "";
    }

    const customersClass = window.location.pathname === "/customers" ? "active" : "";
    const usersClass = window.location.pathname === "/users" ? "active" : "";
    const carsClass = window.location.pathname === "/cars" ? "active" : "";

    const profileClass = getClass(/.profile/);
    const categoryClass = getClass(/.category/);
    const itemClass = getClass(/.item/);
    const appClass = getClass(/.application/);
    const writeOffActClass = getClass(/.write-off-act/)

    const itemPermission = checkPermission && (user.role === "ROLE_SYSTEM_ADMIN" ||
        user.role === "ROLE_DISPATCHER" ||
        user.role === "ROLE_LOGISTICS_SPECIALIST" || user.role === "ROLE_ADMIN");
    const categoryPermission = checkPermission && (user.role === "ROLE_SYSTEM_ADMIN" ||
        user.role === "ROLE_DIRECTOR" || user.role === "ROLE_ADMIN");
    const writeOffActPermission = checkPermission && (user.role === "ROLE_ADMIN" || user.role === "ROLE_DISPATCHER"
        || user.role === "ROLE_DIRECTOR" || user.role === "ROLE_DRIVER" || user.role === "ROLE_SYSTEM_ADMIN");

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" variant="dark" className="header">
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto navigation">
                    {checkPermission &&
                    <Nav.Link className={profileClass}
                              href={`/customers/${user.currentCustomerId}/profile`}>Profile
                    </Nav.Link>}
                    {checkPermission && (user.role === "ROLE_DISPATCHER" || user.role === "ROLE_LOGISTICS_SPECIALIST") &&
                    <Nav.Link className={appClass}
                              href={`/customers/${user.currentCustomerId}/application`}>Application</Nav.Link>}
                    {checkPermission && user.role === "ROLE_SYSTEM_ADMIN" &&
                    <Nav.Link className={customersClass} href="/customers">Customers</Nav.Link>}
                    {isPermittedAndRoleAdmin &&
                    <Nav.Link className={usersClass} href="/users">Users</Nav.Link>}
                    {categoryPermission &&
                    <Nav.Link className={categoryClass}
                              href={`/customers/${user.currentCustomerId}/category`}>
                        Categories
                    </Nav.Link>}
                    {itemPermission &&
                    <Nav.Link className={itemClass}
                              href={`/customers/${user.currentCustomerId}/item`}>Items
                    </Nav.Link>}
                    {writeOffActPermission &&
                    <Nav.Link className={writeOffActClass}
                              href={`/customers/${user.currentCustomerId}/write-off-act`}>Write-off acts
                    </Nav.Link>}
                    {isPermittedAndRoleAdmin &&
                    <Nav.Link className={carsClass} href="/cars">Cars</Nav.Link>}
                    <UserProfile/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Header
