import React, {useContext} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import {AuthContext} from "./context/authContext";

function Header() {

    const {user, setUser} = useContext(AuthContext);

    const checkPermission = user && user.currentCustomerId;

    const profileClass = window.location.pathname.match(/.profile/) ? "active" : "";
    const customersClass = window.location.pathname === "/customers" ? "active" : "";
    const appClass = window.location.pathname === "/application" ? "active" : "";

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" variant="dark" className="header">
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto navigation">
                    {checkPermission &&
                    <Nav.Link className={profileClass}
                              href={`/customers/${user.currentCustomerId}/profile`}>Profile
                    </Nav.Link>}
                    {checkPermission && user.role === "ROLE_SYSTEM_ADMIN" &&
                    <Nav.Link className={customersClass} href="/customers">Customers</Nav.Link>}
                    {checkPermission &&
                    <Nav.Link className={appClass} href="/application">Application</Nav.Link>}
                    <UserProfile/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Header