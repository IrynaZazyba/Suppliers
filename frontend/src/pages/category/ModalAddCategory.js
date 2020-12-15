import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCategory from "../../validation/CategoryValidationRules";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddCategory(props) {

    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [categoryDto, setCategory] = useState({
        category: '',
        taxRate: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleCategoryName = (e) => {
        setCategory(preState => ({
            ...preState,
            category: e.target.value
        }));
    };
    const handleTaxRate = (e) => {
        setCategory(preState => ({
            ...preState,
            taxRate: e.target.value
        }));
    };

    const addCategoryHandler = (e) => {
        e.preventDefault();
        let validationResult = validateCategory(categoryDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            fetch('/customers/' + currentCustomerId + '/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryDto)
            })
                .then(response => {
                    if (response.status !== 200) {
                        setErrors({
                            serverErrors: "Something went wrong, please try later",
                            validationErrors: ''
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: '',
                            validationErrors: []
                        }));
                        setCategory({
                            category: '',
                            taxRate: ''
                        });
                        props.onChange(false, categoryDto);
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
                    setCategory({
                        category: '',
                        taxRate: ''
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicCategory" style={{padding: '5px 10px'}}>
                            Category name
                            <Form.Control type="text" placeholder="Category name" onChange={handleCategoryName}
                                          className={
                                              errors.validationErrors.includes("category")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid category name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicTaxRate" style={{padding: '5px 10px'}}>
                            Tax rate
                            <Form.Control type="number" step="0.001" placeholder="Tax rate(per km)"
                                          onChange={handleTaxRate}
                                          className={
                                              errors.validationErrors.includes("taxRate")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid tax rate.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addCategoryHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddCategory;
