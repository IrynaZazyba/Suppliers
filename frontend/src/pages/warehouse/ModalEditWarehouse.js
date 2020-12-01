import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";
import validateWarehouse from "../../validation/WarehouseValidationRules";
import {FaTrash} from "react-icons/fa";

function ModalEditWarehouse(props) {

    const ref = React.createRef();
    const [dispatcherDeleteList, setDispatcherDeleteList] = useState([]);
    const [dispatchersList, setDispatchersList] = useState([]);
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

    const filterBy = () => true;

    const handleStateSearch = (query) => {
        fetch(`/customers/${props.currentCustomerId}/states?state=${query}`)
            .then(resp => resp.json())
            .then(res => {
                setStateOptions(res);
            });
    };

    function deleteWarehouseFromDispatchers() {
        if (dispatcherDeleteList.length > 0) {
            fetch(`/customers/${props.currentCustomerId}/users/delete-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dispatcherDeleteList)
            })
                .then(function (response) {
                        if (response.status !== 204) {
                            setErrors({
                                serverErrors: "Something go wrong, try later",
                                validationErrors: ''
                            });
                        } else {
                            setErrors(preState => ({
                                ...preState,
                                validationErrors: []
                            }));
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
                    username: i.username
                }));
                setDispatcherOptions(optionsFromBack);
            });
    };

    const handleSearchAllDispatchersById = (id) => {
        fetch(`/customers/${props.currentCustomerId}/users/dispatchers/${id}?id=${id}`)
            .then(resp => resp.json())
            .then(res => {
                const dispatchersFromBack = res.map((i) => ({
                    id: i.id,
                    username: i.username
                }));
                setDispatchersList(dispatchersFromBack);
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
                addressDto: {...preState.addressDto, state: {id: e[0].id, state: e[0].state}}
            })) :
            setWarehouseDto(preState => ({
                ...preState,
                addressDto: {...preState.addressDto, state: {id: '', state: ''}}
            }));
    };

    const addDispatcher = (e) => {
        if (e.length !== 0) {
            e.map(dispatcher =>
                setDispatchersList(preState => ([
                    ...preState, dispatcher
                ])));
        }
    };

    const handleType = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            type: e
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

    const editWarehouseHandler = (e) => {
        e.preventDefault();
        const dispatchersId = dispatchersList.map(dispatcher => dispatcher.id);
        const updateWarehouseDto = {...warehouseDto, dispatchersId: dispatchersId, customerId: props.currentCustomerId}
        deleteWarehouseFromDispatchers();

        let validationResult = validateWarehouse(updateWarehouseDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult,
        }));
        if (validationResult.length === 0) {

            fetch('/customers/' + props.currentCustomerId + '/warehouses/' + warehouseDto.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateWarehouseDto)
            })
                .then(function (response) {
                    if (response.status !== 202 || errors.serverErrors === '') {
                        setErrors({
                            serverErrors: "Something go wrong, try later",
                            validationErrors: ''
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: '',
                            validationErrors: []
                        }));
                        setDispatchersList([]);
                        setDispatcherDeleteList([])
                        props.onChange(false, warehouseDto);
                    }
                });
        }
    };

    const showDispatchers = dispatchersList.map(disp =>
        <div key={disp.id}>
            {disp.username}
            <FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                     onClick={() => {

                         setDispatchersList(
                             dispatchersList.filter((dispatcher) => dispatcher.id !== disp.id));

                         setDispatcherDeleteList([...dispatcherDeleteList, disp.id]);
                     }}
            />
        </div>
    );

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
                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            <Dropdown>
                                <div>select type</div>
                                <Dropdown.Toggle variant="btn btn-outline-primary" id="dropdown-basic">
                                    {warehouseDto.type}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleType("FACTORY")}>FACTORY</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleType("WAREHOUSE")}>WAREHOUSE</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleType("RETAILER")}>RETAILER</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
                                          value={warehouseDto.addressDto.state.state}
                                          disabled
                            />
                        </Form.Group>
                        <Form.Group>
                            <AsyncTypeahead
                                ref={ref}
                                name="state"
                                filterBy={filterBy}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={stateOptions}
                                placeholder="Search, if you want to change state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a value" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group>
                            <div>Selected dispatchers</div>
                            {showDispatchers}
                        </Form.Group>
                        <Form.Group>
                            <AsyncTypeahead
                                ref={ref}
                                name="username"
                                filterBy={filterBy}
                                id="async-username"
                                labelKey="username"
                                minLength={3}
                                options={dispatcherOptions}
                                placeholder="Search, if want to add a new dispatcher..."
                                onSearch={handleDispatcherSearch}
                                onChange={addDispatcher}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("username") ? "Please provide a value" : ""}
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

export default ModalEditWarehouse;
