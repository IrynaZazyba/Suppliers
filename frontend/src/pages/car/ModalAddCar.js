import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import validateCar from "../../validation/CarValidationRules";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

function ModalAddCar(props) {

    const ref = React.createRef();
    const [stateOptions, setStateOptions] = useState([]);
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [carDto, setCar] = useState({
        number: '',
        totalCapacity: '',
        currentCapacity: currentCustomerId,
        customerId: '',
        addressDto: {},
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: {},
        addressLine1: '',
        addressLine2: ''
    });

    const [options, setOptions] = useState([]);

    const filterBy = () => true;
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
    const isValid = (param) => errors.validationErrors.includes(param) ? "form-control is-invalid" : "form-control";

    const addCarHandler = (e) => {
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
                body: JSON.stringify(carDto)
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
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add car
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicLabel" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Number" onChange={handleNumber}
                                          className={
                                              isValid("number")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicCapacity" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="Total capacity"
                                          onChange={handleTotalCapacity}
                                          className={
                                              isValid("totalCapacity")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
                            </Form.Control.Feedback>
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

                                {/*<Form.Control type="text" onChange={onChangeState}*/}
                                {/*              className={*/}
                                {/*                  isValid("state")*/}
                                {/*              }/>*/}
                                {/*<Form.Control.Feedback type="invalid">*/}
                                {/*    Please provide a state.*/}
                                {/*</Form.Control.Feedback>*/}

                            </AsyncTypeahead>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="city" onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine1" onChange={handleaddressLine1}
                                          className={
                                              isValid("addressLine1")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine2" onChange={handleaddressLine2}
                                          className={
                                              isValid("addressLine2")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addCarHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddCar;
