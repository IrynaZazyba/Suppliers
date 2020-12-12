import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import validateWarehouse from "../../validation/WarehouseValidationRules";
import axios from "axios";

function ModalAddWarehouseRetailer(props) {
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const ref = React.createRef();
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        customerId: currentCustomerId,
        identifier: '',
        type: 'RETAILER',
        addressDto: {
            state: {},
            latitude: '',
            longitude: ''
        },
        totalCapacity: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const [options, setOptions] = useState([]);

    const filterBy = () => true;

    const handleSearch = (query) => {
        fetch(`/customers/${currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setOptions(res);
            });
    };

    const onChangeState = (e) => {
        setErrors({
            setErrors: '',
            validationErrors: []
        });
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {
                ...preState.addressDto,
                state: e.length ? {id: e[0].id, state: e[0].stateZone} : {id: '', state: ''}
            }
        }))
    };

    const handleIdentifier = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };


    const handleCity = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {...preState.addressDto, city: e.target.value}
        }));
    };

    const handleLineOne = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {...preState.addressDto, addressLine1: e.target.value}
        }));
    };

    const handleLineTwo = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {...preState.addressDto, addressLine2: e.target.value}
        }));
    };

    const handleTotalCapacity = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            totalCapacity: e.target.value
        }));
    };

    const addWarehouseHandler = (e) => {
        e.preventDefault();

        let location = `${warehouseDto.addressDto.state.state}
                        ${warehouseDto.addressDto.city}
                        ${warehouseDto.addressDto.addressLine1}
                        ${warehouseDto.addressDto.addressLine2}`

        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: 'AIzaSyAwsnzBvhRywcdS27NNkLRr37NXk8uMSBA'
            }
        }).then(function (response) {
            if (response.status !== 200) {
                setErrors(preState => ({
                    ...preState,
                    serverErrors: "Something go wrong, try later",
                }));
            } else {
                let warehouseUpdateDto = {};
                warehouseUpdateDto = {
                    ...warehouseDto,
                    customerId: currentCustomerId,
                    addressDto: {
                        ...warehouseDto.addressDto,
                        latitude: response.data.results[0].geometry.location.lat,
                        longitude: response.data.results[0].geometry.location.lng
                    }
                }
                props.onAddWarehouse(warehouseUpdateDto);
                setWarehouseDto(warehouseUpdateDto);
            }})

        let validationResult = validateWarehouse(warehouseDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult,
            serverErrors: ''
        }));
        if (!validationResult.length) {
            props.onChange(false, warehouseDto)

        }
    };

    return (
        <>
            <Modal
                show={props.props}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-warehouse"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-warehouse">
                        Add warehouse
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="identifier" style={{padding: '5px 10px'}}>
                            Identifier
                            <Form.Control type="text"
                                          onChange={handleIdentifier}
                                          className={
                                              errors.validationErrors.includes("identifier")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid identifier.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <AsyncTypeahead
                                ref={ref}
                                style={{padding: '5px 10px'}}
                                name="state"
                                filterBy={filterBy}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={options}
                                placeholder="Select state..."
                                onSearch={handleSearch}
                                onChange={onChangeState}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a value" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>

                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            city
                            <Form.Control type="text"
                                          onChange={handleCity}
                                          className={
                                              errors.validationErrors.includes("city")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine1" style={{padding: '5px 10px'}}>
                            address line 1
                            <Form.Control type="text"
                                          onChange={handleLineOne}
                                          className={
                                              errors.validationErrors.includes("addressLine1")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine2" style={{padding: '5px 10px'}}>
                            address line 2
                            <Form.Control type="text"
                                          onChange={handleLineTwo}
                                          className={
                                              errors.validationErrors.includes("addressLine2")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                            total capacity
                            <Form.Control type="number"
                                          onChange={handleTotalCapacity}
                                          className={
                                              errors.validationErrors.includes("totalCapacity")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addWarehouseHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddWarehouseRetailer;
