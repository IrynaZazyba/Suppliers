import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";
import validateWarehouse, {validateWarehouseWithIdentifierExist} from "../../validation/WarehouseValidationRules";
import {FaTrash} from "react-icons/fa";
import axios from "axios";

function ModalAddWarehouse(props) {

    const ref = React.createRef();
    const [stateOptions, setStateOptions] = useState([]);
    const [dispatcherOptions, setDispatcherOptions] = useState([]);
    const [dispatchers, setDispatchers] = useState([]);
    const [dropdownMenuName, setDropdownMenuName] = useState("FACTORY");
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        customerId: '',
        identifier: '',
        type: '',
        addressDto: {
            state: {}
        },
        totalCapacity: '',
        dispatchersId: []
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const filterByState = () => true;
    const filterByUsername = () => true;

    const handleStateSearch = (query) => {
        fetch(`/customers/${props.currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setStateOptions(res);
            });
    };

    const handleDispatcherSearch = (query) => {
        fetch(`/customers/${props.currentCustomerId}/users/dispatchers?username=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((dispatcher) => ({
                    id: dispatcher.id,
                    name: dispatcher.name,
                    surname: dispatcher.surname,
                    username: dispatcher.username
                }));
                setDispatcherOptions(optionsFromBack);
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

    const addDispatcher = (e) => {
        if (e.length) {
            const isDispatcherUsed = dispatchers.find(disp => e[0].id === disp.id)
            if (!isDispatcherUsed) {
                e.map(dispatcher =>
                    setDispatchers(preState => ([
                        ...preState, dispatcher
                    ])));
            }
        }
    };

    const handleIdentifier = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    const handleType = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            type: e
        }));
        setDropdownMenuName(e);
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

        let warehouseUpdateDto = {};
        warehouseUpdateDto = {
            ...warehouseDto,
            dispatchersId: (dispatchers.length ? dispatchers.map(dispatcher => dispatcher.id) : []),
            customerId: props.currentCustomerId
        }

        const validationResult = validateWarehouse(warehouseUpdateDto, dropdownMenuName, warehouseUpdateDto.dispatchersId);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult,
            serverErrors: ''
        }))

        if (!validationResult.includes("identifier")) {
            fetch(`/customers/${props.currentCustomerId}/warehouses/identifier?identifier=${warehouseUpdateDto.identifier}`)
                .then(resp => resp.json())
                .then(isIdentifierExist => {
                    const validationResult2 = validateWarehouseWithIdentifierExist(warehouseUpdateDto, dropdownMenuName,
                        warehouseUpdateDto.dispatchersId, isIdentifierExist);
                    setErrors(preState => ({
                        ...preState,
                        validationErrors: validationResult2,
                        serverErrors: ''
                    }));

                    if (!validationResult2.length) {
                        let location =
                            `${warehouseDto.addressDto.state.state} 
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
                                    serverErrors: "Something went wrong, try later",
                                }));
                            } else {
                                let warehouseUpdateDto2 = {
                                    ...warehouseUpdateDto,
                                    addressDto: {
                                        ...warehouseDto.addressDto,
                                        latitude: response.data.results[0].geometry.location.lat,
                                        longitude: response.data.results[0].geometry.location.lng
                                    }
                                }

                                fetch(`/customers/${props.currentCustomerId}/warehouses`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(warehouseUpdateDto2)
                                })
                                    .then(function (response) {
                                        if (response.status !== 201) {
                                            setErrors(preState => ({
                                                ...preState,
                                                serverErrors: "Something went wrong, try later"
                                            }));
                                        } else {
                                            setErrors(preState => ({
                                                ...preState,
                                                validationErrors: [],
                                                serverErrors: ''
                                            }));
                                            setWarehouseDto({
                                                id: '',
                                                customerId: '',
                                                identifier: '',
                                                type: '',
                                                addressDto: {
                                                    state: {}
                                                },
                                                totalCapacity: '',
                                                dispatchersId: []
                                            });
                                            setDispatchers([]);
                                            setDropdownMenuName("FACTORY");
                                            props.onChange(false, warehouseDto)
                                        }
                                    })
                            }
                        })
                    }
                })
        }
    }


    const showDispatchers = dispatchers.map(disp =>
        <div key={disp.id}>
            {disp.name} {disp.surname}, username: {disp.username}
            <FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                     onClick={() => {

                         setDispatchers(
                             dispatchers.filter((dispatcher) => dispatcher.id !== disp.id));
                     }}
            />
        </div>
    );

    const totalCapacityForm = (e) => {
        if (e === "WAREHOUSE") {
            return (
                <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                    Total capacity
                    <Form.Control type="number" placeholder="Total capacity"
                                  onChange={handleTotalCapacity}
                                  className={errors.validationErrors.includes("totalCapacity")
                                      ? "form-control is-invalid" : "form-control"}/>
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid total capacity.
                    </Form.Control.Feedback>
                </Form.Group>
            )
        } else {
            return (<div/>)
        }
    }

    const dispatchersForm = (e) => {
        if (e === "WAREHOUSE") {
            return (
                <Form>
                    <Form.Group>
                        {showDispatchers}
                    </Form.Group>
                    <Form.Group>
                        <span style={{padding: '5px 10px'}}>Dispatcher(s) username</span>
                        <AsyncTypeahead
                            style={{padding: '5px 10px'}}
                            ref={ref}
                            name="username"
                            filterBy={filterByUsername}
                            id="async-username"
                            labelKey="username"
                            minLength={3}
                            options={dispatcherOptions}
                            placeholder="Select dispatcher username..."
                            onSearch={handleDispatcherSearch}
                            onChange={addDispatcher}>
                            <div className="validation-error">
                                {errors.validationErrors.includes("username") ? "Please provide a username" : ""}
                            </div>
                        </AsyncTypeahead>
                    </Form.Group>
                </Form>
            );
        } else {
            return (<div/>)
        }
    }

    return (
        <>
            <Modal
                show={props.lgShow}
                backdrop="static"
                onHide={() => {
                    setErrors({
                        validationErrors: [],
                        serverErrors: ''
                    });
                    setWarehouseDto({
                        id: '',
                        customerId: '',
                        identifier: '',
                        type: '',
                        addressDto: {
                            state: {}
                        },
                        totalCapacity: '',
                        dispatchersId: []
                    });
                    setDispatchers([]);
                    setDropdownMenuName("FACTORY");
                    props.onChange(false);
                }}
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
                            <Form.Control type="text" placeholder="Identifier"
                                          onChange={handleIdentifier}
                                          className={errors.validationErrors.includes("identifier")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid identifier.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            Type
                            <Dropdown>
                                <Dropdown.Toggle variant="btn btn-outline-primary" id="dropdown-basic">
                                    {dropdownMenuName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleType("FACTORY")}>FACTORY</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleType("WAREHOUSE")}>WAREHOUSE</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className="validation-error">
                                {errors.validationErrors.includes("type") ? "Please provide a type" : ""}
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <span style={{padding: '5px 10px'}}>U.S. state</span>
                            <AsyncTypeahead
                                style={{padding: '5px 10px'}}
                                ref={ref}
                                name="state"
                                filterBy={filterByState}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={stateOptions}
                                placeholder="Select U.S. state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a state" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            City
                            <Form.Control type="text" placeholder="City"
                                          onChange={handleCity}
                                          className={errors.validationErrors.includes("city")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine1" style={{padding: '5px 10px'}}>
                            Address line 1
                            <Form.Control type="text" placeholder="Address line 1"
                                          onChange={handleLineOne}
                                          className={errors.validationErrors.includes("addressLine1")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine2" style={{padding: '5px 10px'}}>
                            Address line 2
                            <Form.Control type="text" placeholder="Address line 1"
                                          onChange={handleLineTwo}
                                          className={errors.validationErrors.includes("addressLine2")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            {totalCapacityForm(warehouseDto.type)}
                        </Form.Group>
                        <Form.Group>
                            {dispatchersForm(warehouseDto.type)}
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

export default ModalAddWarehouse;
