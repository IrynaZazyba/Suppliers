import React, {useContext} from 'react';
import {UserContext} from './UserContext';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import UserProfile from "./components/UserProfile";
import LoginButton from "./components/LoginButton";

function Header() {

    const context = useContext(UserContext);

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/test">Test</Nav.Link>
                    <UserProfile/>
                    <LoginButton/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Header