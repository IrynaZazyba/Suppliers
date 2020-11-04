import React, {useContext, useState} from 'react';
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";
import Container from "react-bootstrap/Container";

export default () => {
    const {user, setUser} = useContext(AuthContext);


    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const handleSelect = (e) => {


    };

    return (
        <Container fluid className="mainContainer">
          <Button size="md"
                  type="submit"
                  onClick={handleSubmit}
                  className="mainButton">
              Add
          </Button>
        </Container>    );

}
