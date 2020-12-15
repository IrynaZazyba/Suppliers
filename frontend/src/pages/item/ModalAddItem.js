import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateItemPage from "../../validation/ItemPageValidationRules";
import ErrorMessage from "../../messages/errorMessage";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

function ModalAddItem(props) {

    const ref = React.createRef();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [itemDto, setItem] = useState({
        label: '',
        upc: '',
        units: '',
        customerId: currentCustomerId,
        categoryDto: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const [options, setOptions] = useState([]);

    const filterBy = () => true;

    const handleSearch = (query) => {
        fetch(`/customers/${currentCustomerId}/category/category/${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    category: i.category,
                    taxRate: i.taxRate,
                    customerId: currentCustomerId
                }));
                setOptions(optionsFromBack);
            });
    };

    const onChangeCategory = (e) => {
        setErrors({
            serverErrors: '',
            validationErrors: []
        });
        if (e.length > 0) {
            setItem(preState => ({
                ...preState,
                categoryDto: {
                    id: e[0].id,
                    category: e[0].category,
                    taxRate: e[0].taxRate,
                    customerId: currentCustomerId
                }
            }))
        } else {
            setItem(preState => ({
                ...preState,
                categoryDto: ''
            }));
        }
    };

    const handleLabel = (e) => {
        setItem(preState => ({
            ...preState,
            label: e.target.value
        }));
    };
    const handleUpc = (e) => {
        setItem(preState => ({
            ...preState,
            upc: e.target.value
        }));
    };
    const handleUnits = (e) => {
        setItem(preState => ({
            ...preState,
            units: e.target.value
        }));
    };

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateItemPage(itemDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            fetch(`/customers/${currentCustomerId}/item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemDto)
            })
                .then(response => {
                    if (response.status !== 200) {
                        setErrors({
                            serverErrors: "Something went wrong, try later",
                            validationErrors: ''
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: '',
                            validationErrors: []
                        }));
                        setItem({
                            label: '',
                            upc: '',
                            units: '',
                            customerId: currentCustomerId,
                            categoryDto: ''
                        });
                        props.onChange(false, itemDto);
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
                    setItem({
                        label: '',
                        upc: '',
                        units: '',
                        customerId: currentCustomerId,
                        categoryDto: ''
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicLabel" style={{padding: '5px 10px'}}>
                            Label
                            <Form.Control type="text" placeholder="Label" onChange={handleLabel}
                                          className={
                                              errors.validationErrors.includes("label")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid label.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicUpc" style={{padding: '5px 10px'}}>
                            UPC
                            <Form.Control type="text"
                                          placeholder="Code of item"
                                          onChange={handleUpc}
                                          className={
                                              errors.validationErrors.includes("upc")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid upc.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicUnits" style={{padding: '5px 10px'}}>
                            Units
                            <Form.Control type="number"
                                          step="any"
                                          placeholder="Units"
                                          onChange={handleUnits}
                                          className={
                                              errors.validationErrors.includes("units")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide valid units.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <span style={{padding: '5px 10px'}}>Category</span>
                        <AsyncTypeahead
                            style={{padding: '5px 10px'}}
                            ref={ref}
                            name="category"
                            filterBy={filterBy}
                            id="async-category"
                            labelKey="category"
                            minLength={1}
                            options={options}
                            placeholder="Search category..."
                            onSearch={handleSearch}
                            onChange={onChangeCategory}
                        >
                            <div className="validation-error">
                                {errors.validationErrors.includes("category") ? "Please provide a value" : ""}
                            </div>
                        </AsyncTypeahead>

                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addItemHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddItem;
