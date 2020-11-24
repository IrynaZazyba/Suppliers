import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddWarehouse(props) {

    const [stateDto, setStateDto] = useState({
        state: null
    });
    const [addressDto, setAddressDto] = useState({
        city: '',
        addressLine1: '',
        addressLine2: '',
        stateDto: stateDto
    });

    const [warehouseDto, setWarehouseDto] = useState({
        identifier: '',
        type: '',
        addressDto: addressDto,
        totalCapacity: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleIdentifier = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    const handleType = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            type: e.target.value
        }));
    };

    const handleCity = (e) => {
        setAddressDto(preState => ({
            ...preState,
            city: e.target.value
        }));
    };

    const handleLineOne = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine1: e.target.value
        }));
    };

    const handleLineTwo = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine2: e.target.value
        }));
    };

    // const handleState = (e) => {
    //     setAddressDto(preState => ({
    //         ...preState,
    //         stateDto: state: e.target.value
    //     }));
    // };

    const handleTotalCapacity = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            totalCapacity: e.target.value
        }));
    };

    const addWarehouseHandler = (e) => {
        setWarehouseDto(preState => ({
            ...preState,
            addressDto: addressDto
        }));
        e.preventDefault();
        fetch('/customers/' + props.currentCustomerId + '/warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(warehouseDto)
        });
        props.onChange();
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
                            type
                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          onChange={handleType}
                            />
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

                        {/*<div className="btn-group">*/}
                        {/*    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"*/}
                        {/*            aria-haspopup="true" aria-expanded="false">*/}
                        {/*        /!*{warehouseDto.addressDto.stateDto.state}*!/*/}
                        {/*onChange={handleState}*/}
                        {/*    </button>*/}
                        {/*    <div className="dropdown-menu">*/}
                        {/*        <a className="dropdown-item">Action1</a>*/}
                        {/*        <a className="dropdown-item">Action2</a>*/}
                        {/*        <a className="dropdown-item">Action3</a>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

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
