import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCustomer from "../../validation/CustomerValidationRules";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddRetailer(props) {

    const [retailerDto, setRetailerDto] = useState({
        fullName: '',
        identifier: ''
    });

    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.
    getItem("currentCustomerId"): 0;

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleFullName = (e) => {
        setRetailerDto(preState => ({
            ...preState,
           fullName: e.target.value
        }));
    };
    const handleId = (e) => {
        setRetailerDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    const addRetailerHandler = (e) => {
        e.preventDefault();
       // let validationResult = validateCustomer(retailerDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: ''
        }));
     //   if (validationResult.length === 0) {
            fetch(`/customers/${currentCustomerId}/retailers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(retailerDto)
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
                            validationErrors: []
                        }));
                        props.onChange(false, retailerDto);
                    }
                });
    //    }
    };

    return (
        <>
            <Modal
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add retailer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Name" onChange={handleFullName}
                                          className={
                                              errors.validationErrors.includes("fullName")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid customer name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Identifier" onChange={handleId}
                                          className={
                                              errors.validationErrors.includes("identifier")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid identifier.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addRetailerHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddRetailer;
