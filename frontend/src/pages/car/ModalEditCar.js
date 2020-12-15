import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ErrorMessage from "../../messages/errorMessage";
import validateCar from "../../validation/CarValidationRules";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

function ModalEditCar(props) {

    const ref = React.createRef();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [carDto, setCar] = useState({
        id: '',
        number: '',
        totalCapacity: '',
        currentCapacity: '',
        customerId: currentCustomerId,
        addressDto: {},
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });


    const [options, setOptions] = useState([]);
    const filterBy = () => true;
    const [stateOptions, setStateOptions] = useState([]);
    const filterByState = () => true;

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: {},
        addressLine1: '',
        addressLine2: ''
    });

    const handleNumber = (e) => {
        setCar(preState => ({
            ...preState,
            number: e.target.value
        }));
    };
    const handleTotalCapacity = (e) => {
        setCar(preState => ({
            ...preState,
            totalCapacity: e.target.value,
            currentCapacity: e.target.value
        }));
    };
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

    const handleCity = (e) => {
        setAddressDto(preState => ({
            ...preState,
            city: e.target.value
        }));
        setCar(preState => ({
            ...preState,
            addressDto: addressDto
        }));
    };
    const handleaddressLine1 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine1: e.target.value
        }));
        setCar(preState => ({
            ...preState,
            addressDto: addressDto
        }));
    };
    const handleaddressLine2 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine2: e.target.value
        }));
        setCar(preState => ({
            ...preState,
            addressDto: addressDto
        }));

    };
    const isValid = (param) => errors.validationErrors.includes(param) ? "form-control is-invalid" : "form-control";


    useEffect(() => {
        if (props.props.editShow === true) {
            fetch(`/customers/${currentCustomerId}/car/${props.props.car.id}`)
                .then(response => response.json())
                .then(res => {

                    setCar(res);
                    setAddressDto(res.addressDto);
                });
        }
    }, [props.props.editShow]);


    const editCarHandler = (e) => {
        e.preventDefault();

        let carUpdateDto = {};
        carUpdateDto = {
            ...carDto,
            addressDto: addressDto
        };

        let validationResult = validateCar(carUpdateDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            fetch(`/customers/${currentCustomerId}/car`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carUpdateDto)
            })
                .then(response => {
                    if (response.status !== 201) {
                        setErrors({
                            serverErrors: "Something went wrong, try later",
                            validationErrors: ''
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            validationErrors: []
                        }));
                        props.onChange(false, carDto);
                    }
                });
        }
    };

    return (
        <>
            <Modal
                show={props.props.editShow}
                onHide={() => {
                    setErrors({
                        validationErrors: [],
                        serverErrors: ''
                    });
                    props.onChange(false)
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit Car
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>

                        <Form.Group controlId="formBasicLabel" style={{padding: '5px 10px'}}>
                            <Form.Label>Number</Form.Label>
                            <Form.Control type="text" placeholder="Number" value={carDto.number} onChange={handleNumber}
                                          className={
                                              isValid("number")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicCapacity" style={{padding: '5px 10px'}}>
                            <Form.Label>Total capacity</Form.Label>
                            <Form.Control type="text"
                                          value={carDto.totalCapacity}
                                          placeholder="Total capacity"
                                          onChange={handleTotalCapacity}
                                          className={
                                              isValid("totalCapacity")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                            Current state
                            <Form.Control type="text"
                                          value={addressDto.state.state}
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
                            <Form.Control type="text" placeholder="city" value={addressDto.city} onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Label>Address line 1</Form.Label>
                            <Form.Control type="text" placeholder="addressLine1" value={addressDto.addressLine1}
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
                            <Form.Control type="text" placeholder="addressLine2" value={addressDto.addressLine2}
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
                                    onClick={editCarHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditCar;
