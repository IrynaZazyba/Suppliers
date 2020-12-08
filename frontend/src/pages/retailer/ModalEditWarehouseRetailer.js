import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";
import validateWarehouse from "../../validation/WarehouseValidationRules";

function ModalEditWarehouseRetailer(props) {
    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.
    getItem("currentCustomerId"): 0;

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
        setErrors({
            setErrors: '',
            validationErrors: []
        });
        e.length > 0 ?
            setWarehouseDto(preState => ({
                ...preState,
                addressDto: {...preState.addressDto, state: {id: e[0].id, state: e[0].stateZone}}
            })) :
            setWarehouseDto(preState => ({
                ...preState,
                addressDto: {...preState.addressDto, state: {id: '', state: ''}}
            }));
    };

    useEffect(() => {
        if (props.props.editShow === true) {

                    setWarehouseDto(JSON.parse(localStorage.getItem("warehouse")));

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

    const handleTotalCapacity = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            totalCapacity: e.target.value
        }));
    };

    const editWarehouseHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWarehouse(warehouseDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult,
            serverErrors: ''
        }));
        if (validationResult.length === 0) {
            setWarehouseDto(warehouseDto);
            localStorage.setItem("warehouse", JSON.stringify(warehouseDto));

        }
    };

    return (
        <>
            <Modal
                show={props.props.editShow}
                onHide={() => props.onChange(false)}
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
                        <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                            total capacity
                            <Form.Control type="text"
                                          onChange={handleTotalCapacity}
                                          value={warehouseDto.totalCapacity}
                                          className={
                                              errors.validationErrors.includes("totalCapacity")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
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
