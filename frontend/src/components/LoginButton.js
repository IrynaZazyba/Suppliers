import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/authContext';
import Button from "react-bootstrap/Button";
import {useHistory, useLocation} from "react-router-dom";

export default () => {
    const {user, login} = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const history = useHistory();

    const routeChange = () => {
        let path = `/login`;
        history.push(path);
    };

    return !user && useLocation().pathname !== "/login" &&
        (
            <div>
                <Button variant="outline-primary"
                        style={{
                            position: 'absolute',
                            right: '15px',
                        }}
                        onClick={() => {
                            routeChange()
                        }}>
                    Sign in
                </Button>
            </div>
        );

}

