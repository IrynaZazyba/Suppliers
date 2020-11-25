import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Dropdown from "react-bootstrap/Dropdown";

function ModalAddWarehouse(props) {

    const ref = React.createRef();
    const [dropdownMenuName, setDropdownMenuName] = useState("select type");
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        identifier: '',
        type: '',
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
                // console.log(res.content);
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
        fetch('/customers/' + props.currentCustomerId + '/warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(warehouseDto)
        })
            .then(() => props.onChange(null, warehouseDto));
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
                        <Form.Group controlId="Identifier" style={{padding: '5px 10px'}}>
                            Identifier
                            <Form.Control type="text"
                                          onChange={handleIdentifier}
                            />
                        </Form.Group>

                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            <Dropdown>
                                <Dropdown.Toggle variant="" id="dropdown-basic">
                                    {dropdownMenuName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleType("Factory")}>FACTORY</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleType("Warehouse")}>WAREHOUSE</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleType("Retailer")}>RETAILER</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </Form.Group>
                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            city
                            <Form.Control type="text"
                                          onChange={handleCity}
                            />
                        </Form.Group>
                        <Form.Group controlId="addressLine1" style={{padding: '5px 10px'}}>
                            address line 1
                            <Form.Control type="text"
                                          onChange={handleLineOne}
                            />

                        </Form.Group>
                        <Form.Group controlId="addressLine2" style={{padding: '5px 10px'}}>
                            address line 2
                            <Form.Control type="text"
                                          onChange={handleLineTwo}
                            />
                        </Form.Group>
                        <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                            total capacity
                            <Form.Control type="text"
                                          onChange={handleTotalCapacity}
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
