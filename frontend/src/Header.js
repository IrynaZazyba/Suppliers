import React, {useContext} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import {AuthContext} from "./context/authContext";

function Header() {

    const {user, setUser} = useContext(AuthContext);

    const profileClass = window.location.pathname.match(/.profile/) ? "active" : "";
    const customersClass = window.location.pathname==="/customers" ? "active" : "";

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" variant="dark" className="header">
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav style={{height: '45px'}} className="mr-auto">
                    {user && user.currentCustomerId ?
                        <Nav.Link className={profileClass}
                                  href={"/customers/" + user.currentCustomerId + "/profile"}>Profile
                        </Nav.Link> : null}
                    {user && user.currentCustomerId && user.role === "ROLE_SYSTEM_ADMIN" ?
                        <Nav.Link className={customersClass} href="/customers">Customers</Nav.Link> : null}
                    <UserProfile/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Header