import React, {useContext, useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";
import Card from "react-bootstrap/Card";


export default () => {
    const {user, setUser} = useContext(AuthContext);
    const [zones, setZones] = useState([]);
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;
    const [zone, setZone] = useState([]);
    const [addressDto, setAddressDto] = useState({
        city: '',
        state: null,
        addressLine1: '',
        addressLine2: ''
    });
    const [userDto, setUserDto] = useState({
        id: '',
        name: '',
        surname: '',
        birthday: '',
        addressDto: '',
        role: '',
        password: '',
        username: '',
        email: ''
    });
    const [state, setState] = useState({
        id: '',
        state: ''
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

    const handlePassword = (e) => {
        setUserDto(preState => ({
            ...preState,
            password: e.target.value
        }));
    };


    const handleBirthday = (e) => {
        setUserDto(preState => ({
            ...preState,
            birthday: e.target.value
        }));
    };
    const handleCity = (e) => {
        setAddressDto(preState => ({
            ...preState,
            city: e.target.value
        }));
    };
    const handleaddressLine1 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine1: e.target.value
        }));
    };
    const handleaddressLine2 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine2: e.target.value
        }));
        setUser(preState => ({
            ...preState,
            addressDto: addressDto
        }));

    };
    const onChangeState = (e) => {
        const selectedState = zones.find(state => state.state === e.target.value);

        setZone(preState => ({
            ...preState,
            state: selectedState
        }));
        setAddressDto(preState => ({
            ...preState,
            state: selectedState
        }));
    };

    useEffect(() => {
        fetch(`/customers/${currentCustomerId}/users/username/${user.username}`)
            .then(response => response.json())
            .then(res => {
                setZone(res.addressDto.state);
                setAddressDto(res.addressDto);
                setUserDto(res);
                setState(res.addressDto.state);
            });
        fetch('/states')
            .then(response => response.json())
            .then(commits => {
                setZones(commits.content);
            });

    }, []);


    const editUserHandler = (e) => {
        e.preventDefault();

        fetch(`/customers/${currentCustomerId}/users/${userDto.id}`, {
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
    const isValid = (param) => validError.includes(param) ? "form-control is-invalid" : "form-control";
    const editPasswordHandler = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(userDto.password));
        fetch(`/customers/${currentCustomerId}/users/${userDto.id}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDto.password)
        })
            .then(function (response) {
                if (response.status !== 200) {
                    setError('');
                    setErrors("Something go wrong, try later");
                } else {
                    setError('Password changed');

                }
            });

    };

    return (
        <div style={{
            margin: '70px 10px',
            height: '40px'
        }}>
            <Alert variant="success">
                <Alert.Heading> Info about user </Alert.Heading>
            </Alert>
            <div className="ProfileCard" style={{
                alignSelf: "center",
                padding: "2px 300px 400px 500px"
            }}>

                <Card style={{width: '25rem'}}
                      className="shadow p-3 mb-5 bg-white rounded">
                    <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                        Info about user
                    </Card.Header>
                    <Card.Body> <Form>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text"
                                          placeholder="name"
                                          onChange={handleName}
                                          value={userDto.name}
                                          className={
                                             isValid("name")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text"
                                          placeholder="surname"
                                          onChange={handleSurname}
                                          value={userDto.surname}
                                          className={
                                              isValid("surname")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid surname.
                            </Form.Control.Feedback>

                        </Form.Group>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text"
                                          placeholder="username"
                                          readOnly={true}
                                          value={userDto.username}
                                          className={
                                              isValid("username")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid username.
                            </Form.Control.Feedback>

                        </Form.Group>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Label>Birthday date</Form.Label>
                            <Form.Control type="date" placeholder="birthday" value={userDto.birthday}
                                          onChange={handleBirthday}
                                          className={
                                              isValid("birthday")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid date.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="email" value={userDto.email} readOnly={true}
                                          className={
                                              isValid("email")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" placeholder="role" value={userDto.role} readOnly={true}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicState" style={{padding: '5px 10px'}}>
                            <Form.Label>State</Form.Label>
                            <Form.Control style={{padding: '5px 10px'}} value={zone.state} as="select"

                                          onChange={onChangeState}>
                                {Object.entries(zones).map(([k, v]) => (

                                    <option>{v.state}</option>

                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="city" value={addressDto.city} onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText"  style={{padding: '5px 10px'}}>
                            <Form.Label>Address line 1</Form.Label>
                            <Form.Control type="text" placeholder="addressLine1" value={addressDto.addressLine1} onChange={handleaddressLine1}
                                          className={
                                              isValid("addressLine1")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText"  style={{padding: '5px 10px'}}>
                            <Form.Label>Address line 2</Form.Label>
                            <Form.Control type="text" placeholder="addressLine2" value={addressDto.addressLine2} onChange={handleaddressLine2}
                                          className={
                                              isValid("addressLine2")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="password" placeholder="change password" onChange={handlePassword}
                            />

                        </Form.Group>


                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editUserHandler}>
                                Save
                            </Button>
                        </div>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editPasswordHandler}>
                                Change Password
                            </Button>
                        </div>
                    </Form>
                    </Card.Body>
                </Card>
            </div>

        </div>

    )
}