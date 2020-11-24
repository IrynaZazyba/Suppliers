import React, {useContext} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import {AuthContext} from "./context/authContext";
import Warehouse from "./pages/warehouse/Warehouses";

function Header() {

    const {user, setUser} = useContext(AuthContext);

    const checkPermission = user && user.currentCustomerId;

    const profileClass = defineActiveClassWithMatch(/.profile/);
    const customersClass = window.location.pathname === "/customers" ? "active" : "";
    const warehousesClass = window.location.pathname.match(/.warehouses/) ? "active" : "";
    const appClass = defineActiveClassWithMatch(/.application/);

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
                    {checkPermission &&
                    <Nav.Link className={warehousesClass}
                              href={`/customers/${user.currentCustomerId}/warehouses`}>Warehouses
                    </Nav.Link>}
                    <UserProfile/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

    function defineActiveClassWithMatch(path) {
        return window.location.pathname.match(path) ? "active" : "";
    }
}


export default Header
