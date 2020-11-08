import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCustomerName from "../../validation/CustomerValidationRules";
import ErrorMessage from "../../messages/errorMessage";

function ModalEditCustomer(props) {

    const [customerDto, setCustomer] = useState({
        id: '',
        name: '',
        adminEmail: ''
    });
    const [validError, setError] = useState([]);
    const [errorMessage, setErrors] = useState('');

    const handleName = (e) => {
        setCustomer(preState => ({
            ...preState,
            name: e.target.value
        }));
    };

    useEffect(() => {
        if (props.props.editShow === true) {
            fetch("/customers/" + props.props.customer.id)
                .then(response => response.json())
                .then(res => {
                    setCustomer(res);
                });
        }
    }, [props.props.editShow]);


    const editCustomerHandler = (e) => {
        e.preventDefault();
        let validationResult = validateCustomerName(customerDto);
        setError(validationResult);
           if (validationResult.length === 0) {
               fetch('/customers/' + customerDto.id, {
                   method: 'PUT',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(customerDto)
               })
                   .then(function (response) {
                       if (response.status !== 200) {
                           setError('');
                           setErrors("Something go wrong, try later");
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
                show={props.props.editShow}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit customer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    <Form>
                        <Form.Group controlId="editCustomer" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="Company name"
                                          onChange={handleName}
                                          value={customerDto.name}
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
                            <Form.Control type="email"
                                          value={customerDto.adminEmail}
                                          placeholder="Admin email"
                                          disabled
                            />
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editCustomerHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditCustomer;