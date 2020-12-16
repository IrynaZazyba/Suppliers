import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import validateWarehouseRetailer from "../../validation/WarehouseValidationRules";
import axios from "axios";

function ModalEditWarehouseRetailer(props) {
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const ref = React.createRef();
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        customerId: currentCustomerId,
        identifier: '',
        addressDto: {
            state: {}
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
        fetch(`/customers/${props.currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setOptions(res);
            });
    };

    const onChangeState = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {
                ...preState.addressDto,
                state: (e.length ?
                    {id: e[0].id, state: e[0].state}
                    : {id: '', state: ''})
            }
        }));
    };

    useEffect(() => {
        if (props.props.editShow) {
            setWarehouseDto(props.props.warehouse);

        }
    }, [props.props.editShow]);


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

    const handleState = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: {...preState.addressDto, state: e.target.value}
        }));
    };


    const editWarehouseHandler = (e) => {
        e.preventDefault();
        let warehouseUpdateDto = {};
        let location = `${warehouseDto.addressDto.state.state}
                        ${warehouseDto.addressDto.city}
                        ${warehouseDto.addressDto.addressLine1}
                        ${warehouseDto.addressDto.addressLine2}`

        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: 'API_KEY'
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

                setWarehouseDto(warehouseUpdateDto);
                let validationResult = validateWarehouseRetailer(warehouseUpdateDto);
                setErrors(preState => ({
                    ...preState,
                    validationErrors: validationResult,
                    serverErrors: ''
                }));
                if (!validationResult.length) {
                    props.onEditWarehouse(warehouseUpdateDto);
                    props.onChange(false, warehouseUpdateDto);
                }
            }
        })

    };

    return (
        <>
            <Modal
                show={props.props.editShow}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    setWarehouseDto({});
                    props.onChange(false)}}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit warehouse
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="identifier" style={{padding: '5px 10px'}}>
                            Identifier
                            <Form.Control type="text"
                                          disabled
                                          value={warehouseDto.identifier}
                            />
                        </Form.Group>

                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            city
                            <Form.Control type="text"
                                          onChange={handleCity}
                                          value={warehouseDto.addressDto.city}
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
                                          value={warehouseDto.addressDto.addressLine1}
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
                                          value={warehouseDto.addressDto.addressLine2}
                                          className={
                                              errors.validationErrors.includes("addressLine2")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                            current state
                            <Form.Control type="text"
                                          onChange={handleState}
                                          value={warehouseDto.addressDto.state.state}
                                          disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                        <AsyncTypeahead
                            ref={ref}
                            name="state"
                            filterBy={filterBy}
                            id="async-state"
                            labelKey="state"
                            minLength={3}
                            options={options}
                            placeholder="Search, if you want to change state..."
                            onSearch={handleSearch}
                            onChange={onChangeState}
                        >
                            <div className="validation-error">
                                {errors.validationErrors.includes("state") ? "Please provide a value" : ""}
                            </div>
                        </AsyncTypeahead>
                        </Form.Group>

                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editWarehouseHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditWarehouseRetailer;
