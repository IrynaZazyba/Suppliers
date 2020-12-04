import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {validateEditWarehouse} from "../../validation/WarehouseValidationRules";
import {FaTrash} from "react-icons/fa";

function ModalEditWarehouse(props) {

    const ref = React.createRef();
    const [dispatcherDeleteList, setDispatcherDeleteList] = useState([]);
    const [dispatchers, setDispatchers] = useState([]);
    const [dispatcherOptions, setDispatcherOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
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

    useEffect(() => {
        if (props.props.editShow === true) {
            fetch("/customers/" + props.currentCustomerId + "/warehouses/" + props.props.warehouse.id)
                .then(response => response.json())
                .then(res => {
                    setWarehouseDto(res);
                })
            handleSearchAllDispatchersById(props.props.warehouse.id);
        }
    }, [props.props.editShow]);

    const filterByState = () => true;
    const filterByUsername = () => true;

    const handleStateSearch = (query) => {
        fetch(`/customers/${props.currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setStateOptions(res);
            });
    };

    const deleteWarehouseFromDispatchers = (dispatcherDeleteList) => {
        if (dispatcherDeleteList.length > 0) {
            fetch(`/customers/${props.currentCustomerId}/users/dispatchers/delete-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dispatcherDeleteList)
            })
                .then(function (response) {
                        if (response.status !== 204) {
                            setErrors({
                                serverErrors: "Something go wrong, try later"
                            });
                        }
                    }
                )
        }
    };

    const handleDispatcherSearch = (query) => {
        fetch(`/customers/${props.currentCustomerId}/users/dispatchers?username=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    name: i.name,
                    surname: i.surname,
                    username: i.username
                }));
                setDispatcherOptions(optionsFromBack);
            });
    };

    const handleSearchAllDispatchersById = (id) => {
        fetch(`/customers/${props.currentCustomerId}/users/dispatchers/${id}?id=${id}`)
            .then(resp => resp.json())
            .then(res => {
                const dispatchersFromBack = res.map((dispatcher) => ({
                    id: dispatcher.id,
                    name: dispatcher.name,
                    surname: dispatcher.surname,
                    username: dispatcher.username
                }));
                setDispatchers(dispatchersFromBack);
            });
    };

    const onChangeState = (e) => {
        e.length > 0 ?
            setWarehouseDto(preState => ({
                ...preState,
                addressDto: {...preState.addressDto, state: {id: e[0].id, state: e[0].state}}
            })) :
            setWarehouseDto(preState => ({
                ...preState,
                addressDto: {...preState.addressDto, state: {id: '', state: ''}}
            }));
    };

    const addDispatcher = (e) => {
        if (e.length !== 0) {
            const isContains = dispatchers.find(disp => e[0].id === disp.id)
            if (!isContains) {
                e.map(dispatcher =>
                    setDispatchers(preState => ([
                        ...preState, dispatcher
                    ])));
            }
        }
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

    const editWarehouseHandler = (e) => {
        e.preventDefault();
        const dispatchersId = dispatchers.map(dispatcher => dispatcher.id);
        const updateWarehouseDto = {...warehouseDto, dispatchersId: dispatchersId, customerId: props.currentCustomerId}
        deleteWarehouseFromDispatchers(dispatcherDeleteList);

        let validationResult = validateEditWarehouse(updateWarehouseDto, dispatchersId);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));
        if (!validationResult.length) {
            fetch('/customers/' + props.currentCustomerId + '/warehouses/' + warehouseDto.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateWarehouseDto)
            })
                .then(function (response) {
                    if (response.status !== 202 || errors.serverErrors !== '') {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: "Something go wrong, try later",
                        }));
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: '',
                            validationErrors: []
                        }));
                        setDispatchers([]);
                        setDispatcherDeleteList([])
                        props.onChange(false, warehouseDto);
                    }
                });
        }
    };

    const showDispatchers = dispatchers.map(disp =>
        <div key={disp.id}>
            {disp.name} {disp.surname}, username: {disp.username}
            <FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                     onClick={() => {

                         setDispatchers(
                             dispatchers.filter((dispatcher) => dispatcher.id !== disp.id));

                         setDispatcherDeleteList([...dispatcherDeleteList, disp.id]);
                     }}
            />
        </div>
    );

    const dispatchersForm = (e) => {
        if (e === "WAREHOUSE") {
            return (
                <Form>
                    <Form.Group>
                        {showDispatchers}
                    </Form.Group>
                    <Form.Group>
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
                            onChange={addDispatcher}
                        >
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
                show={props.props.editShow}
                backdrop="static"
                onHide={() => {
                    setErrors({
                        validationErrors: [],
                        serverErrors: ''
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-warehouse"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-warehouse">
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
                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            Identifier
                            <Form.Control type="text"
                                          disabled
                                          value={warehouseDto.type}
                            />
                        </Form.Group>
                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            city
                            <Form.Control type="text"
                                          onChange={handleCity}
                                          value={warehouseDto.addressDto.city}
                                          className={errors.validationErrors.includes("city")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine1" style={{padding: '5px 10px'}}>
                            address line 1
                            <Form.Control type="text"
                                          onChange={handleLineOne}
                                          value={warehouseDto.addressDto.addressLine1}
                                          className={errors.validationErrors.includes("addressLine1")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="addressLine2" style={{padding: '5px 10px'}}>
                            address line 2
                            <Form.Control type="text"
                                          onChange={handleLineTwo}
                                          value={warehouseDto.addressDto.addressLine2}
                                          className={errors.validationErrors.includes("addressLine2")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                            total capacity
                            <Form.Control type="text"
                                          onChange={handleTotalCapacity}
                                          value={warehouseDto.totalCapacity}
                                          className={errors.validationErrors.includes("totalCapacity")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="state" style={{padding: '5px 10px'}}>
                            current state
                            <Form.Control type="text"
                                          value={warehouseDto.addressDto.state.state}
                                          disabled
                            />
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
                                onChange={onChangeState}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a state" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group>
                            {dispatchersForm(warehouseDto.type)}
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

export default ModalEditWarehouse;
