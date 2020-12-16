import React, {useContext, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {AuthContext} from "../../context/authContext";
import validateUserWithUsername from "../../validation/EditUserValidationRules";

function ModalAddUser(props) {

    const {user, setUsers} = useContext(AuthContext);
    const ref = React.createRef();
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;
    const [stateOptions, setStateOptions] = useState([]);
    const [addressDto, setAddressDto] = useState({
        city: '',
        state: { id: '', state: ''},
        addressLine1: '',
        addressLine2: ''
    });
    const [userDto, setUser] = useState({
        name: '',
        surname: '',
        birthday: '',
        addressDto: {},
        role: 'ROLE_SYSTEM_ADMIN',
        username: '',
        email: '',
        customerId: currentCustomerId
    });
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
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
        setUser(preState => ({
            ...preState,
            name: e.target.value
        }));
    };

    const handleSurname = (e) => {
        setUser(preState => ({
            ...preState,
            surname: e.target.value
        }));
    };
    const handleUsername = (e) => {
        setUser(preState => ({
            ...preState,
            username: e.target.value
        }));
    };
    const handleBirthday = (e) => {
        setUser(preState => ({
            ...preState,
            birthday: e.target.value
        }));
    };
    const handleRole = (e) => {
        setUser(preState => ({
            ...preState,
            role: e.target.value
        }));
    };
    const handleEmail = (e) => {
        setUser(preState => ({
            ...preState,
            email: e.target.value
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
    const addUserHandler = (e) => {
        e.preventDefault();

        let userUpdateDto = {};
        userUpdateDto = {
            ...userDto,
            addressDto: addressDto
        };

        const validationResult2 = validateUserWithUsername(userUpdateDto, addressDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult2,
            serverErrors: ''
        }));
        if (!validationResult2.length) {
            fetch(`/customers/${currentCustomerId}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userUpdateDto)
            })
                .then(function (response) {
                    if (response.status !== 201) {
                        setErrors("Something go wrong, try later");
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            validationErrors: [],
                            serverErrors: ''
                        }));
                        setUser({
                            name: '',
                            surname: '',
                            birthday: '',
                            addressDto: {},
                            role: 'ROLE_SYSTEM_ADMIN',
                            username: '',
                            email: '',
                            customerId: ''
                        });
                        setAddressDto({
                            city: '',
                            state: {},
                            addressLine1: '',
                            addressLine2: ''
                        });

                        props.onChange(false, userDto);
                    }
                });
        }

    }
    const isValid = (param) => errors.validationErrors.includes(param) ? "form-control is-invalid" : "form-control";

    return (
        <>
            <Modal
                show={props.props}
                onHide={() => {
                    setErrors({
                        validationErrors: [],
                        serverErrors: ''
                    });
                    props.onChange(false)
                }}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Name" onChange={handleName}
                                          className={
                                              isValid("name")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Surname" onChange={handleSurname}
                                          className={
                                              isValid("surname")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid surname.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Username" onChange={handleUsername}
                                          className={
                                              isValid("username")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid username.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicDate" style={{padding: '5px 10px'}}>
                            <Form.Control type="date" placeholder="Birthday" onChange={handleBirthday}
                                          className={
                                              isValid("birthday")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicRole" style={{padding: '5px 10px'}}>
                            <Form.Control style={{padding: '5px 10px '}} as="select"
                                          defaultValue="Choose..."
                                          onChange={handleRole}>

                                {user.role === 'ROLE_SYSTEM_ADMIN' &&
                                <option value={"ROLE_SYSTEM_ADMIN"}>System admin</option>}
                                {user.role === 'ROLE_ADMIN' && <option value={"ROLE_ADMIN"}>Admin</option>}
                                <option value={"ROLE_DISPATCHER"}>Dispatcher</option>
                                <option value={"ROLE_LOGISTICS_SPECIALIST"}>Logistic specialist</option>
                                <option value={"ROLE_DRIVER"}>Driver</option>
                                <option value={"ROLE_DIRECTOR"}>Director</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <AsyncTypeahead
                                style={{padding: '5px 10px'}}
                                ref={ref}
                                name="state"
                                filterBy={filterByState}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={stateOptions}
                                placeholder="Select state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}>
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a state" : ""}
                                </div>

                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="City" onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="AddressLine1" onChange={handleaddressLine1}
                                          className={
                                              isValid("addressLine1")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="AddressLine2" onChange={handleaddressLine2}
                                          className={
                                              isValid("addressLine2")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                            <Form.Control type="email" placeholder="Email" onChange={handleEmail}
                                          className={
                                              isValid("email")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addUserHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddUser;
