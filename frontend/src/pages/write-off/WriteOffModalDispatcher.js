import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FaTrash} from "react-icons/fa";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {validateWriteOffActItem} from "../../validation/WriteOffValidationRules";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../../messages/errorMessage";
import validateWriteOffAct from "../../validation/WriteOffValidationRules";

function ModalAddWriteOff(props) {

    const refIdentifier = React.createRef();
    const refUpc = React.createRef();
    const refReason = React.createRef();
    const [customerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [currentWarehouse, setCurrentWarehouse] = useState({
        id: '',
        identifier: '',
        address: ''
    });
    const [writeOffDto, setWriteOff] = useState({});
    const [warehouseOptions, setWarehouseOptions] = useState([]);
    const [reasonOptions, setReasonOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: 0,
        totalSum: 0
    });

    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e !== fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    const handleSearchWarehouse = (query) => {
        fetch(`/customers/${customerId}/warehouses/type/identifier?type=WAREHOUSE&identifier=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    identifier: i.identifier,
                    address: i.addressDto
                }));
                setWarehouseOptions(optionsFromBack);
            });
    };

    const handleSearchItems = (query) => {
        fetch(`/customers/${customerId}/warehouses/${currentWarehouse.id}/items?itemUpc=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.item.id,
                    upc: i.item.upc,
                    label: i.item.label,
                    units: i.item.units,
                    cost: i.cost,
                    amount: i.amount
                }));
                setItemOptions(optionsFromBack);
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

    const onChangeWarehouse = (e) => {
        if (e.length > 0) {
            setCurrentWarehouse(preState => ({
                ...preState,
                id: e[0].id,
                identifier: e[0].identifier,
                address: e[0].address
            }));
        } else {
            setCurrentWarehouse({
                address: {
                    addressLine1: '',
                    addressLine2: ''
                }
            });
        }
        setItems([]);
    };

    const onChangeUpc = (e) => {
        checkValidationErrors('upc');
        checkValidationErrors('exist');
        if (e.length > 0) {
            setCurrentItem(preState => ({
                ...preState,
                id: e[0].id,
                upc: e[0].upc,
                label: e[0].label,
                units: e[0].units,
                cost: e[0].cost,
                sum: e[0].cost * e[0].amount,
                amount: e[0].amount,
                reason: ''
            }));
            refReason.current.clear();
        } else {
            setCurrentItem('');
        }
    };

    const onChangeReason = (e) => {
        checkValidationErrors('reason');
        e.length > 0 ?
            setCurrentItem(preState => ({
                ...preState,
                reason: {
                    id: e[0].id,
                    reason: e[0].reason
                }
            })) :
            setCurrentItem(preState => ({
                ...preState,
                reason: ''
            }))
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

    const handleIdentifier = (e) => {
        setWriteOff(preState => ({
            ...preState,
            identifier: e.target.value
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

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWriteOffActItem(currentItem, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            setItems([
                ...items, currentItem
            ]);
            setCurrentItem({});
            setErrors(prevState => ({
                ...prevState,
                validationErrors: []
            }));
            refUpc.current.clear();
            refReason.current.clear();
        }
    };

    useEffect(() => {
        setCurrentItem('');
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseFloat(i.amount), 0),
                totalSum: items.reduce((totalSum, i) => totalSum + parseFloat(i.sum), 0)
            })
        );
    }, [items]);

    const addActHandler = (e) => {
        e.preventDefault();

        let writeOffAct = prepareActDto();
        let validErrors = validateWriteOffAct(writeOffAct, items, currentWarehouse);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));

        if (validErrors.length === 0) {
            fetch(`/customers/${customerId}/write-off-act`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(writeOffAct)
            }).then(response => {
                if (response.status === 400) {
                    response.json().then(json => {
                        let res = Object.values(json).join('. ');
                        setErrors({
                            serverErrors: res,
                            validationErrors: ''
                        });
                    });
                }
                if (response.status !== 200 && response.status !== 400) {
                    setErrors({
                        serverErrors: "Something went wrong, try later. Maybe you are trying to write off more items " +
                            "than warehouse contains.",
                        validationErrors: ''
                    });
                }
                if (response.status === 200) {
                    setErrors(preState => ({
                        ...preState,
                        validationErrors: []
                    }));
                    setWriteOff([]);
                    setItems([]);
                    props.onChange(false, writeOffDto);
                }
            });
            refIdentifier.current.clear();
        }
    };

    function prepareActDto() {
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
            identifier: writeOffDto.identifier,
            totalSum: totalValues.totalSum,
            totalAmount: totalValues.totalAmount,
            items: itemInAct,
            customerId: customerId,
            warehouseId: currentWarehouse.id
        };
    }


    const itemsTable =
        <React.Fragment>
            {items.length > 0 &&
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Sum</th>
                    <th>Reason</th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {items.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.upc}</td>
                        <td>{i.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.sum}</td>
                        <td>{i.reason.reason}</td>
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
                <Col sm="2">
                    <AsyncTypeahead
                        ref={refUpc}
                        name="upc"
                        filterBy={filterBy}
                        id="async-example"
                        labelKey="upc"
                        minLength={3}
                        options={itemOptions}
                        placeholder="Search item..."
                        onSearch={handleSearchItems}
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
                <Col sm="2">
                    <Form.Control name="label" disabled placeholder="label" type="text"
                                  value={currentItem && currentItem.label}/>
                </Col>
                <Col>
                    <Form.Control name="amount" placeholder="amount" type="number" min='1'
                                  value={currentItem && currentItem.amount}
                                  onChange={handleInput('amount')}
                                  onBlur={() => {
                                      let itemSum = currentItem.amount * currentItem.cost;
                                      setCurrentItem(prevState => ({
                                          ...prevState,
                                          sum: itemSum
                                      }));
                                  }}
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
                    <Form.Control name="sum" placeholder="sum" type="text"
                                  disabled
                                  value={currentItem && currentItem.sum}
                    />
                </Col>
                <Col sm="2">
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
                <Form.Group as={Row} controlId="actIdentifier">
                    <Form.Label column sm="3">Identifier</Form.Label>
                    <Col sm="6">
                        <AsyncTypeahead
                            ref={refIdentifier}
                            name="identifier"
                            filterBy={filterBy}
                            id="async-example"
                            labelKey="identifier"
                            minLength={3}
                            options={warehouseOptions}
                            placeholder="Search warehouse by identifier..."
                            onSearch={handleSearchWarehouse}
                            onChange={onChangeWarehouse}
                        >
                            <div className="validation-error">
                                {errors.validationErrors.includes("identifier") ? "Please provide a value" : ""}
                            </div>
                        </AsyncTypeahead>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="addressLine1">
                    <Form.Label column sm="3">Address line 1</Form.Label>
                    <Col sm="6">
                        <Form.Control type="text"
                                      value={currentWarehouse.address.addressLine1}
                                      placeholder="Address line 1"
                                      disabled
                        /></Col>
                </Form.Group>
                <Form.Group as={Row} controlId="addressLine2">
                    <Form.Label column sm="3">Address line 2</Form.Label>
                    <Col sm="6">
                        <Form.Control type="text"
                                      value={currentWarehouse.address.addressLine2}
                                      placeholder="Address line 2"
                                      disabled
                        /></Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formBasicText">
                    <Form.Label column sm="3">Act identifier</Form.Label>
                    <Col sm="6">
                        <Form.Control type="text" placeholder="Act identifier" onChange={handleIdentifier}
                                      className={
                                          errors.validationErrors.includes("act-identifier")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }/>
                        <Form.Control.Feedback type="invalid">
                            Please provide an identifier.
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
                        <h6>Total summary of items</h6>
                        <Card.Text>
                            <h3> {totalValues.totalSum}</h3>
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
                    setCurrentWarehouse({address: ''});
                    setWriteOff({});
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create write-off act
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        {actDataFields}
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
                            <Button type="submit" className="mainButton pull-right" onClick={addActHandler}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default ModalAddWriteOff;
