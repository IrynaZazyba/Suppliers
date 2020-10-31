import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/authContext';
import Button from "react-bootstrap/Button";
import {FaUser} from 'react-icons/fa';


export default () => {
    const {user, logout} = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return user &&
        (
            <div>
                <Button variant="outline-primary"
                        className="primaryButton"
                        style={{
                            position: 'absolute',
                            right: '15px',
                        }}
                        onClick={() => {
                            logout();
                            handleClose();
                        }}>
                    <FaUser style={{
                        margin: ' 0 10px 4px 0',
                    }}/>
                    Logout
                </Button>
            </div>
        );
}

