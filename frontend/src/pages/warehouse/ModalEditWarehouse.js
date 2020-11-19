import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";

function ModalEditWarehouse(props) {

    // const address = [addressDto, setAddress] = useState({
    //     city: '',
    //     AddressLine1: '',
    //     AddressLine2: '',
    //     state: ''
    // });
    const [warehouseDto, setWarehouse] = useState({
        id: '',
        identifier: '',
        type: '',
        // address,
        totalCapacity: ''
    });
    const [customerDto, setCustomer] = useState({
        id: '',
        name: '',
        adminEmail: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleName = (e) => {
        setWarehouse(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    // useEffect(() => {
    //     if (props.props.editShow === true) {
    //         fetch("/customers/" + props.props.customer.id)
    //             .then(response => response.json())
    //             .then(res => {
    //                 setWarehouse(res);
    //             });
    //     }
    // }, [props.props.editShow]);


    const editWarehouseHandler = (e) => {
        e.preventDefault();
        // let validationResult = validateCustomerName(warehouseDto);
        // setErrors(preState => ({
        //     ...preState,
        //     validationErrors: validationResult
        // }));
        //    if (validationResult.length === 0) {
               fetch('/customers/' + customerDto.id + '/warehouses/' + warehouseDto.id, {
                   method: 'PUT',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(warehouseDto)
               }
               )
                   .then(function (response) {
                       if (response.status !== 200) {
                           setErrors({
                               serverErrors: "Something go wrong, try later",
                               validationErrors: ''
                           });
                       } else {
                           setErrors(preState => ({
                               ...preState,
                               validationErrors: []
                           }));
                           props.onChange(false, warehouseDto);
                       }
                   });
           // }
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
                        <Form.Group controlId="editWarehouse" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="Identifier"
                                          disabled
                                          onChange={handleName}
                                          value={warehouseDto.identifier}
                                          className={
                                              errors.validationErrors.includes("identifier")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid warehouse identifier.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="type" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          value={warehouseDto.type}
                                          placeholder="type"
                            />

                            //todo address lines for edit


                        </Form.Group>
                        <Form.Group controlId="totalCapacity" style={{padding: '5px 10px'}}>
                            <Form.Control type="number"
                                          value={warehouseDto.totalCapacity}
                                          placeholder="total capacity"
                            />
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
