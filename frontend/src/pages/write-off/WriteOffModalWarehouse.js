import React, {useEffect, useState} from 'react';
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
import validateWriteOffAct, {validateWriteOffActItem} from "../../validation/WriteOffValidationRules";


function WriteOffWarehouseModal(props) {

    const ref = React.createRef();
    const refReason = React.createRef();

    const [customerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);
    const [warehouseDto, setWarehouse] = useState({
        id: '',
        identifier: '',
        type: ''
    });
    const [reason, setReason] = useState({
        id: '',
        reason: ''
    });
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [writeOffDto, setWriteOff] = useState({
        total_sum: '',
        total_amount: '',
        reason_id: '',
        customer_id: '',
        items: []
    });
    const [options, setOptions] = useState([]);
    const [reasonOptions, setReasonOptions] = useState([]);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: 0,
        totalSum: 0
    });

    const handleSearch = (query) => {
        fetch(`/customers/${customerId}/warehouses/${props.props.warehouseId}/items?itemUpc=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.item.id,
                    upc: i.item.upc,
                    label: i.item.label,
                    units: i.item.units,
                    cost: i.cost
                }));

                setOptions(optionsFromBack);
            });
    };

    const handleSearchReason = (query) => {
        fetch(`/customers/${customerId}/write-off-act/reason?reason=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    reason: i.reason
                }));
                setReasonOptions(optionsFromBack);
            });
    };

    const filterBy = () => true;

    const onChangeUpc = (e) => {
        checkValidationErrors('upc');
        checkValidationErrors('exist');
        console.log(e[0]);

        e.length > 0 ?
            setCurrentItem(preState => ({
                ...preState,
                id: e[0].id,
                upc: e[0].upc,
                label: e[0].label,
                units: e[0].units,
                cost: e[0].cost,
                reason: ''
            })) :
            setCurrentItem('');
    };

    const onChangeReason = (e) => {
        checkValidationErrors('reason');
        e.length > 0 ?
            setCurrentItem(preState => ({
                ...preState,
                id: e[0].id,
                reason: e[0].reason
            })) :
            setCurrentItem('');
    };

    const handleInput = (fieldName) =>
        (e) => {
            const value = parseFloat(e.target.value);
            checkValidationErrors(fieldName);
            setCurrentItem(preState => ({
                ...preState,
                [fieldName]: value,
                sum: value * currentItem.cost,
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
        console.log(items);
        setCurrentItem('');
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseInt(i.amount), 0),
                totalSum: items.reduce((totalSum, i) => totalSum + parseFloat(i.cost) * parseFloat(i.amount), 0)
            })
        );
    }, [items]);

    useEffect(() => {
        if (props.props.writeOffShow === true) {
            fetch(`/customers/${customerId}/warehouses/${props.props.warehouseId}`)
                .then(response => response.json())
                .then(res => {
                    setWarehouse(res);
                });
        }
    }, [props.props.writeOffShow]);

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWriteOffActItem(currentItem, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validationResult
        }));

        console.log(validationResult);
        console.log(currentItem);

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
            refReason.current.clear();

        }
    };

    function prepareWriteOff() {
        let itemInAct = [];
        items.forEach(i => {
            let itemAct = {
                sum: i.sum,
                amount: i.amount,
                itemDto: {
                    id: i.id,
                },
                writeOffActReasonDto: i.reason
            };
            itemInAct.push(itemAct);
        });

        return {
            identifier: warehouseDto.identifier,
            totalSum: totalValues.totalSum,
            totalAmount: totalValues.totalAmount,
            items: itemInAct,
            customerId: customerId,
            warehouseId: warehouseDto.id
        };
    }

    const warehouseHandler = (e) => {
        e.preventDefault();
        let writeOff = prepareWriteOff();
        console.log(writeOff);
        let validErrors = validateWriteOffAct(writeOff, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));

        console.log(validErrors);
        if (validErrors.length === 0) {
            fetch(`/customers/${customerId}/write-off-act`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(writeOff)
            })
                .then(function (response) {
                    if (response.status !== 200) {
                        setErrors({
                            serverErrors: "Something went wrong, try later",
                            validationErrors: []
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            validationErrors: []
                        }));
                        setWriteOff([]);
                        setItems([]);
                        props.onChange(false, writeOffDto);
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
                    <th>Amount</th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {items.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.upc}</td>
                        <td>{i.amount}</td>
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
                <Col sm="3">
                    <AsyncTypeahead
                        ref={refReason}
                        name="reason"
                        filterBy={filterBy}
                        id="async-example"
                        labelKey="reason"
                        minLength={3}
                        options={reasonOptions}
                        placeholder="Search reason..."
                        onSearch={handleSearchReason}
                        onChange={onChangeReason}
                    >
                        <div className="validation-error">
                            {errors.validationErrors.includes("reason") ? "Please provide a value" : ""}
                        </div>
                    </AsyncTypeahead>
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

    const actDataFields =
        <Row>
            <Col sm={8}>
                <Form.Group as={Row} controlId="identifier">
                    <Form.Label column sm="3">Identifier</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text"
                                      disabled
                                      value={warehouseDto.identifier}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="type">
                    <Form.Label column sm="3">Warehouse type</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text"
                                      disabled
                                      value={warehouseDto.type}/>
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
                            <h3>{totalValues.totalSum}</h3>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>;


    return (
        <>
            <Modal
                show={props.props.writeOffShow}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    setItems([]);
                    setWriteOff([]);
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create write-off modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        {actDataFields}
                        <div className="validation-error">
                            {errors.validationErrors.includes("items") ? "Items shouldn't be empty" : ""}
                        </div>
                        <Card border="primary" style={{width: '100%', marginTop: '20px'}}>
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
