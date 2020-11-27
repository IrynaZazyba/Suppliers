import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";
import validateWarehouse from "../../validation/WarehouseValidationRules";
import {FaTrash} from "react-icons/fa";

function ModalAddWarehouse(props) {

    const ref = React.createRef();
    const [dispatcherIdList, setDispatcherIdList] = useState([]);
    const [dispatcherList, setDispatcherList] = useState([]);
    const [dropdownMenuName, setDropdownMenuName] = useState("select type");
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        customerId: props.currentCustomerId,
        identifier: '',
        type: '',
        addressDto: {
            state: {}
        },
        totalCapacity: '',
        usersId: dispatcherIdList
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const [stateOptions, setStateOptions] = useState([]);
    const [dispatcherOptions, setDispatcherOptions] = useState([]);

    const filterBy = () => true;

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
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    username: i.username
                }));
                setDispatcherOptions(optionsFromBack);
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

    const onChangeDispatcher = (e) => {

        if (e.length!==0) {
            dispatcherList.push(e);
            console.log(dispatcherList)
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
        let validationResult = validateWarehouse(warehouseDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult,
            serverErrors: ''
        }));
        if (validationResult.length === 0) {
            fetch('/customers/' + props.currentCustomerId + '/warehouses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(warehouseDto)
            })
                .then(function (response) {
                        if (response.status !== 201) {
                            setErrors({
                                serverErrors: "Something go wrong, try later",
                                validationErrors: ''
                            });
                        } else {
                            setErrors(preState => ({
                                ...preState,
                                validationErrors: [],
                                serverErrors: ''
                            }));
                            dispatcherList.map(object => (object.map(dispatcher =>
                                dispatcherIdList.push(dispatcher.id)
                            )))
                            props.onChange(false, warehouseDto)
                            setDispatcherList([]);
                            setDispatcherIdList([]);
                        }
                    }
                )
        }
    };

    const dispatchers = dispatcherList.map(dispatcherObject => (dispatcherObject.map(dispatcher =>
        <div key={dispatcher.id}>
            {dispatcher.username}
            <FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                     onClick={() => {
                         const index = dispatcherList.indexOf(dispatcherObject);
                         console.log(index)
                         dispatcherList.splice(index, 1)
                     }}
            />
        </div>
    )));

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

                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            <Dropdown>
                                <Dropdown.Toggle variant="btn btn-outline-primary" id="dropdown-basic">
                                    {dropdownMenuName}
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
                        <Form.Group>
                            <AsyncTypeahead
                                ref={ref}
                                name="state"
                                filterBy={filterBy}
                                id="async-state"
                                labelKey="state"
                                minLength={3}
                                options={stateOptions}
                                placeholder="Select state..."
                                onSearch={handleStateSearch}
                                onChange={onChangeState}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("state") ? "Please provide a value" : ""}
                                </div>
                            </AsyncTypeahead>
                        </Form.Group>
                        <Form.Group>
                            {dispatchers}
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
                                placeholder="Select dispatcher username..."
                                onSearch={handleDispatcherSearch}
                                onChange={onChangeDispatcher}
                            >
                                <div className="validation-error">
                                    {errors.validationErrors.includes("username") ? "Please provide a username" : ""}
                                </div>
                            </AsyncTypeahead>
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
