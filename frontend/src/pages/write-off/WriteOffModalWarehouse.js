import React, {useContext, useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {FaTrash} from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../../messages/errorMessage";
import {validateWriteOffItem} from "../../validation/ItemValidationRules";
import validateWarehouseInWriteOffAct from "../../validation/WarehouseValidationRules";
import calculateItemPrice, {calculateDistance, recalculateItems} from "../application/CalculatePrice";


function WriteOffWarehouseModal(props) {

    const ref = React.createRef();
    const [customerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);
    const [warehouseId, setWarehouseId] = useState('');
    const [warehouse, setWarehouse] = useState({
        id: '',
        identifier: '',
        type: ''
    });
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [writeOffDto, setWriteOff] = useState({
        totalSum: '',
        reason: '',
        items: []
    });
    const [options, setOptions] = useState([]);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });

    const handleSearch = (query) => {
        fetch(`/customers/${customerId}/warehouses/${props.warehouseId}/items?itemUpc=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.item.id,
                    upc: i.item.upc,
                    label: i.item.label,
                    units: i.item.units,
                    category: i.item.categoryDto,
                    cost: i.cost
                }));

                setOptions(optionsFromBack);
            });
    };

    const filterBy = () => true;

    const onChangeUpc = (e) => {
        checkValidationErrors('upc');
        checkValidationErrors('exist');
        e.length > 0 ?
            setCurrentItem(preState => ({
                ...preState,
                id: e[0].id,
                upc: e[0].upc,
                label: e[0].label,
                units: e[0].units,
                category: e[0].category,
                cost: e[0].cost

            })) :
            setCurrentItem('');
    };

    const handleInput = (fieldName) =>
        (e) => {
            const value = e.target.value;
            checkValidationErrors(fieldName);
            setCurrentItem(preState => ({
                ...preState,
                [fieldName]: value
            }));
        };

    const deleteItem = (e) => {
        let afterDelete = [];
        items.forEach(i => {
            if (i.id != e.currentTarget.id) {
                afterDelete.push(i);
            }
        });
        setItems(afterDelete);
    };

    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    useEffect(() => {
        setCurrentItem('');
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseInt(i.amount), 0),
                totalUnits: items.reduce((totalUnits, i) => totalUnits + parseFloat(i.units), 0)
            })
        );
    }, [items]);

    useEffect(() => {
        fetch(`/customers/${customerId}/warehouses/${warehouseId}`)
            .then(response => response.json())
            .then(res => {
                setWarehouse(res);
            });
    }, []);

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWriteOffItem(currentItem, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            setItems([
                ...items, currentItem
            ]);
            setCurrentItem('');
            setErrors(prevState => ({
                ...prevState,
                validationErrors: []
            }));
            ref.current.clear();
        }
    };

    function prepareWarehouse() {
        return {
            total_sum: ,
            reason_id: reason.id,
            customer_id: customerId
        };
    }

    const warehouseHandler = (e) => {
        e.preventDefault();

        let validErrors = validateWarehouseInWriteOffAct(warehouse, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));

        if (validErrors.length === 0) {
            let application = prepareWarehouse();
            fetch(`/customers/${customerId}/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(application)
            })
                .then(function (response) {
                    if (response.status !== 200) {
                        setErrors({
                            serverErrors: "Something go wrong, try later",
                            validationErrors: []
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            validationErrors: []
                        }));
                        setApp([]);
                        setItems([]);
                        props.onChange(false, appDto);
                    }
                });
        }
    };

    const itemsTable =
        <React.Fragment>
            {items.length > 0 &&
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Price, $ per unit</th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {items.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.upc}</td>
                        <td>{i.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.price}</td>
                        <td style={{textAlign: 'center'}}>
                            <FaTrash id={i.id} style={{color: '#1A7FA8'}}
                                     onClick={deleteItem}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>}
        </React.Fragment>;

    const inputsAddItems =
        <>
            <Row>
                <Col sm="3">
                    <AsyncTypeahead
                        ref={ref}
                        name="upc"
                        filterBy={filterBy}
                        id="async-example"
                        labelKey="upc"
                        minLength={3}
                        options={options}
                        placeholder="Search item..."
                        onSearch={handleSearch}
                        onChange={onChangeUpc}
                    >
                        <div className="validation-error">
                            {errors.validationErrors.includes("upc") ? "Please provide a value" : ""}
                        </div>
                        <div className="validation-error">
                            {errors.validationErrors.includes("exist") ? "Such item already exists" : ""}
                        </div>
                    </AsyncTypeahead>
                </Col>
                <Col sm="3">
                    <Form.Control name="label" disabled placeholder="label" type="text"
                                  value={currentItem && currentItem.label}/>
                </Col>
                <Col>
                    <Form.Control name="amount" placeholder="amount" type="number" min='1'
                                  value={currentItem && currentItem.amount}
                                  onChange={handleInput('amount')}
                                  className={
                                      errors.validationErrors.includes("amount")
                                          ? "form-control is-invalid"
                                          : "form-control"
                                  }/>
                    <Form.Control.Feedback type="invalid">
                        Please provide a value.
                    </Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Control name="price" placeholder="price" type="number"
                                  disabled
                                  value={currentItem && currentItem.price}
                    />

                </Col>
                <Col sm="1">
                    <Button id={currentItem && currentItem.id} type="submit"
                            variant="outline-primary"
                            className="primaryButton"
                            onClick={addItemHandler}>
                        Add
                    </Button>
                </Col>
            </Row>
        </>;

    const appDataFields =
        <Row>
            <Col sm={8}>
                <Form.Group as={Row} controlId="identifier">
                    <Form.Label column sm="3">Identifier</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text"
                                      disabled
                                      value={warehouse.identifier}
                                      className={
                                          errors.validationErrors.includes("identifier")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }/>
                        <Form.Control.Feedback type="invalid">
                            Please provide an identifier.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="type">
                    <Form.Label column sm="3">Warehouse type</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text"
                                      disabled
                                      value={warehouse.type}
                                      className={
                                          errors.validationErrors.includes("type")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }/>
                        <Form.Control.Feedback type="invalid">
                            Please provide warehouse type.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
            </Col>
            <Col sm={2} style={{marginLeft: '-25px'}}>
                <Card className="total-card">
                    <Card.Body>
                        <h6>Total amount of items</h6>
                        <Card.Text>
                            <h3>{totalValues.totalAmount}</h3>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={2}>
                <Card className="total-card">
                    <Card.Body>
                        <h6>Total number of units</h6>
                        <Card.Text>
                            <h3> {totalValues.totalUnits}</h3>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>;


    return (
        <>
            <Modal
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    setItems([]);
                    setApp([]);
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create shipment application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        {appDataFields}
                        <div className="validation-error">
                            {errors.validationErrors.includes("items") ? "Items shouldn't be empty" : ""}
                        </div>
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>
                                {inputsAddItems}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {itemsTable}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="float-right" style={{padding: '10px'}}>
                            <Button type="submit" className="mainButton pull-right" onClick={warehouseHandler}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default WriteOffWarehouseModal;
