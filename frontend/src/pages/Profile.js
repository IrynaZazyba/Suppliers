import React, {useContext, useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";
import Card from "react-bootstrap/Card";
import {AsyncTypeahead} from "react-bootstrap-typeahead";


export default () => {
    const {user, setUser} = useContext(AuthContext);
    const [stateOptions, setStateOptions] = useState([]);
    const ref = React.createRef();
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;
    const [addressDto, setAddressDto] = useState({
        city: '',
        state: {},
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
    const filterByState = () => true;

    const onChangeState = (e) => {
        setAddressDto(preState => ({
            ...preState,
            state: (e.length ?
                {id: e[0].id, state: e[0].state}
                : {id: '', state: ''})
        }));
    };

    const handleStateSearch = (query) => {
        fetch(`/customers/${currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setStateOptions(res);
            });
    };
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
        Alert.name = "Password changed";
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
    };

    useEffect(() => {
        fetch(`/customers/${currentCustomerId}/users/username/${user.username}`)
            .then(response => response.json())
            .then(res => {
                setAddressDto(res.addressDto);
                setUserDto(res);
                userDto.addressDto && setState(res.addressDto.state);
            });
    }, []);


    const editUserHandler = (e) => {
        e.preventDefault();

        let userUpdateDto = {};
        userUpdateDto = {
            ...userDto,
            addressDto: addressDto
        };


        fetch(`/customers/${currentCustomerId}/users/${userDto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userUpdateDto)
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
                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                            Current state
                            <Form.Control type="text"
                                          value={addressDto && addressDto.state.state}
                                          disabled/>
                        </Form.Group>
                        <Form.Group style={{padding: '5px 10px'}}>
                            <Form.Label>State</Form.Label>
                            <AsyncTypeahead
                                ref={ref}
                                name="state"
                                filterBy={filterByState}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={stateOptions}
                                placeholder="Search, if you want to change state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}>

                                {/*<Form.Control type="text" onChange={onChangeState}*/}
                                {/*              className={*/}
                                {/*                  isValid("state")*/}
                                {/*              }/>*/}
                                {/*<Form.Control.Feedback type="invalid">*/}
                                {/*    Please provide a state.*/}
                                {/*</Form.Control.Feedback>*/}

                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group controlId="formBasicState" style={{padding: '5px 10px'}}>
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="city" value={addressDto && addressDto.city}
                                          onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicState" style={{padding: '5px 10px'}}>
                            <Form.Label>Address line 1</Form.Label>
                            <Form.Control type="text" placeholder="AddressLine1"
                                          value={addressDto && addressDto.addressLine1}
                                          onChange={handleaddressLine1}
                                          className={
                                              isValid("addressLine1")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicState" style={{padding: '5px 10px'}}>
                            <Form.Label>Address line 2</Form.Label>
                            <Form.Control type="text" placeholder="AddressLine2"
                                          value={addressDto && addressDto.addressLine2}
                                          onChange={handleaddressLine2}
                                          className={
                                              isValid("addressLine2")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>





                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editUserHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                    </Card.Body>
                </Card>
                <Card style={{width: '25rem'}}

                      className="shadow p-3 mb-5 bg-white rounded">
                    <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                        Change password
                    </Card.Header>
                    <Card.Body> <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="password" placeholder="Change password" onChange={handlePassword}
                            />

                        </Form.Group>
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
