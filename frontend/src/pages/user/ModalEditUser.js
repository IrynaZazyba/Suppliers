import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import validateUserWithUsername from "../../validation/UserValidationRules";

function ModalEditUser(props) {

    const [userDto, setUser] = useState({
        id: '',
        name: '',
        username: '',
        surname: '',
        birthday: ''
    });
    const ref = React.createRef();
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [stateOptions, setStateOptions] = useState([]);
    const filterByState = () => true;

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: { id: '', state: ''},
        addressLine1: '',
        addressLine2: ''
    });

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

    const handleBirthday = (e) => {
        setUser(preState => ({
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
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    useEffect(() => {
        if (props.props.editShow) {
            fetch(`/customers/${currentCustomerId}/users/${props.props.user.id}`)
                .then(response => response.json())
                .then(res => {
                    setUser(res);
                    setAddressDto(res.addressDto);
                });
        }
    }, [props.props.editShow]);


    const editUserHandler = (e) => {
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
        fetch(`/customers/${currentCustomerId}/users/${userDto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userUpdateDto)
        })
            .then((response) => {
                if (response.status !== 200) {
                    setErrors("Something go wrong, try later");
                } else {
                    setErrors(preState => ({
                        ...preState,
                        validationErrors: [],
                        serverErrors: ''
                    }));
                    props.onChange(false, userDto);
                }
            });

    }; }
    const isValid = (param) => errors.validationErrors.includes(param) ? "form-control is-invalid" : "form-control";

    return (
        <>
            <Modal
                show={props.props.editShow}
                onHide={() => { setErrors({
                    validationErrors: [],
                    serverErrors: ''
                });
                props.onChange(false)}}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Name"
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
                                          placeholder="Surname"
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
                                          placeholder="Username"
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
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control type="date" placeholder="Birthday" value={userDto.birthday}
                                          onChange={handleBirthday}
                                          className={
                                              isValid("birthday")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                            Current state
                            <Form.Control type="text"
                                          value={addressDto && addressDto.state.state}
                                          disabled/>
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
                                placeholder="Search, if you want to change state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}>

                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a state" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="City" value={addressDto && addressDto.city}
                                          onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
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


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
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
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditUser;
