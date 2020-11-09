import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCustomer from "../../validation/CustomerValidationRules";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddCustomer(props) {

    const [customerDto, setCustomer] = useState({
        name: '',
        adminEmail: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleName = (e) => {
        setCustomer(preState => ({
            ...preState,
            name: e.target.value
        }));
    };
    const handleEmail = (e) => {
        setCustomer(preState => ({
            ...preState,
            adminEmail: e.target.value
        }));
    };

    const addCustomerHandler = (e) => {
        e.preventDefault();
        let validationResult = validateCustomer(customerDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            fetch('/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerDto)
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
                        props.onChange(false, customerDto);
                    }
                });
        }
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
                        Add customer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Company name" onChange={handleName}
                                          className={
                                              errors.validationErrors.includes("name")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid customer name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                            <Form.Control type="email" placeholder="Admin email" onChange={handleEmail}
                                          className={
                                              errors.validationErrors.includes("email")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addCustomerHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddCustomer;
