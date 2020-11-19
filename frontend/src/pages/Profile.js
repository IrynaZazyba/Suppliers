import React, {useContext, useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert'
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../messages/errorMessage";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";
import Card from "react-bootstrap/Card";


export default () => {
    const {user, setUser} = useContext(AuthContext);
    const [states, setStates] = useState([]);
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: null,
        addressLine1: '',
        addressLine2: ''
    });
    const [userDto, setUserDto] = useState({
        id: user.id,
        name: user.name,
        surname: user.surname,
        birthday: user.birthday,
        addressDto: user.addressDto,
        role: user.role,
        username: user.username,
        email: user.email,
        customerId: currentCustomerId
    });
    const [validError, setError] = useState([]);
    const [errorMessage, setErrors] = useState('');
    const handleName = (e) => {
        setUserDto(preState => ({
            ...preState,
            name: e.target.value
        }));
    };
    const handleSurname = (e) => {
        setUserDto(preState => ({
            ...preState,
            surname: e.target.value
        }));
    };

    const handleBirthday = (e) => {
        setUserDto(preState => ({
            ...preState,
            birthday: e.target.value
        }));
    };


    useEffect(() => {
console.log(user.username);

    }, );


    const editUserHandler = (e) => {
        e.preventDefault();

        fetch("customers/" +  currentCustomerId + "/users/" + userDto.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDto)
        })
            .then(function (response) {
                if (response.status !== 200) {
                    setError('');
                    setErrors("Something go wrong, try later");
                } else {
                    setError('');

                }
            });

    };

    return (
        <div style={{
            margin: '70px 10px',
            height: '40px'
        }}>
            <Alert variant="success">
                <Alert.Heading>Welcome</Alert.Heading>
            </Alert>
            <div className="ProfileCard">

                <Card style={{width: '25rem'}}
                      className="shadow p-3 mb-5 bg-white rounded">
                    <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                        Info about user
                    </Card.Header>
                    <Card.Body>  <Form>
                        <Form.Group controlId="editUserr" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="name"
                                          onChange={handleName}
                                          value={user.name}
                                          className={
                                              validError.includes("name")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid  name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="surname"
                                          onChange={handleSurname}
                                          value={user.surname}
                                          className={
                                              validError.includes("surname")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid  surname.
                            </Form.Control.Feedback>
                            <div className="float-right" style={{paddingRight: '10px'}}>
                                <Button type="submit" className="mainButton pull-right"
                                        onClick={editUserHandler}>
                                    Save
                                </Button>
                            </div>
                        </Form.Group>

                    </Form>
                    </Card.Body>
                </Card>
            </div>

        </div>

    )
}