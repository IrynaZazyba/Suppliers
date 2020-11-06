import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCustomer from "../validation/CustomerValidationRules";

function ModalCustomer(props) {


    const [customerDto, setCustomer] = useState({
        name: '',
        adminEmail: ''
    });
    const [validError, setError] = useState([]);

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
        console.log(customerDto);
        console.log(validError);
        let validationResult = validateCustomer(customerDto);
        setError(validationResult);
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
                        console.log("error");
                        setError('');
                    } else {
                        setError('');
                        props.onChange(false, customerDto);
                    }
                });
        }
    };

    return (
        <>
            <Modal
                show={props.props}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add customer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Company name" onChange={handleName}
                                          className={
                                              validError.includes("name")
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
                                              validError.includes("email")
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

export default ModalCustomer;