import React, {useContext, useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {AuthContext} from "../../context/authContext";
import {FaTrash} from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../../messages/errorMessage";
import {validateShipmentItem} from "../../validation/ItemValidationRules";
import validateApplication from "../../validation/ApplicationValidationRules";
import calculateItemPrice, {calculateDistance, recalculateItems} from "./CalculatePrice";


function AddShipmentApplication(props) {

    const ref = React.createRef();
    const [appDto, setApp] = useState({
        number: '',
        sourceId: '',
        destinationId: '',
        items: []
    });
    const {user, setUser} = useContext(AuthContext);
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const customerId = user.currentCustomerId;
    const [options, setOptions] = useState([]);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });
    const [warehouses, setWarehouses] = useState({
        source: [],
        destination: []
    });
    const [taxes, setTaxes] = useState();

    const handleSearch = (query) => {
        fetch(`/customers/${customerId}/warehouses/${warehouses.source[0].id}/items?itemUpc=${query}`)
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

    const handleAppSourceLocations = (e) => {
        const value = e.currentTarget.value;
        checkValidationErrors("sourceId");
        setApp(preState => ({
            ...preState,
            sourceId: value
        }));
        ref.current.clear();
        setCurrentItem('');
        if (appDto.destinationId && value && items.length !== 0) {
            recalculatePrices(value, appDto.destinationId);
        }
    };

    const handleAppDestinationLocations = (e) => {
        const value = e.currentTarget.value;
        checkValidationErrors('destinationId');
        setApp(preState => ({
            ...preState,
            destinationId: value
        }));
        ref.current.clear();
        setCurrentItem('');
        if (appDto.sourceId && value && items.length !== 0) {
            recalculatePrices(appDto.sourceId, value);
        }
    };

    function recalculatePrices(sourceId, destinationId) {
        let distance = calculateDistance(warehouses, sourceId, destinationId);
        let itemPrice = recalculateItems(items, taxes, distance, destinationId);
        setItems(itemPrice);
    }

    const appNumberOnChange = (e) => {
        const value = e.target.value;
        checkValidationErrors("number");
        setApp(preState => ({
            ...preState,
            number: value
        }))
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
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseFloat(i.amount), 0),
                totalUnits: items.reduce((totalUnits, i) => totalUnits + parseFloat(i.units) * parseFloat(i.amount), 0)
            })
        );
    }, [items]);

    useEffect(() => {
        if (props.props) {
            Promise.all([
                fetch(`/customers/${customerId}/warehouses/type?type=WAREHOUSE&byDispatcher=true`),
                fetch(`/customers/${customerId}/warehouses/type?type=RETAILER`),
                fetch(`/taxes`)
            ]).then(res => Promise.all(res.map(r => r.json())))
                .then(content => {
                    setWarehouses(preState => ({
                        ...preState,
                        source: content[0]
                    }));
                    setWarehouses(preState => ({
                        ...preState,
                        destination: content[1]
                    }));
                    setTaxes(content[2]);
                });
        }
    }, [props]);

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateShipmentItem(currentItem, items, appDto);
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

    function prepareAppDto() {
        let itemInApp = [];
        items.forEach(i => {
            let itemApp = {
                cost: i.price,
                amount: i.amount,
                itemDto: {
                    id: i.id,
                }
            };
            itemInApp.push(itemApp);
        });

        return {
            number: appDto.number,
            sourceLocationDto: {
                id: appDto.sourceId,
            },
            destinationLocationDto: {
                id: appDto.destinationId
            },
            items: itemInApp,
            customerId: user.currentCustomerId,
            type: 'TRAFFIC'
        };
    }

    const addAppHandler = (e) => {
        e.preventDefault();

        let validErrors = validateApplication(appDto, items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));

        if (validErrors.length === 0) {
            let application = prepareAppDto();
            fetch(`/customers/${customerId}/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(application)
            }).then(response => {
                if (response.status === 400) {
                    response.json().then(json => {
                        let res = Object.values(json).join('. ');
                        setErrors({
                            serverErrors: res,
                            validationErrors: []
                        });
                    });
                }
                if (response.status !== 200 && response.status !== 400) {
                    setErrors({
                        serverErrors: "Something go wrong, try later",
                        validationErrors: []
                    });
                }
                if (response.status === 200) {
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
                                  onBlur={() => {
                                      if (appDto.destinationId && appDto.sourceId) {
                                          let distance = calculateDistance(warehouses, appDto.sourceId, appDto.destinationId);
                                          let itemPrice = calculateItemPrice(currentItem, taxes, distance, appDto.destinationId);
                                          setCurrentItem(prevState => ({
                                              ...prevState,
                                              price: itemPrice
                                          }));
                                      }
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
                <Form.Group as={Row} controlId="appNumber">
                    <Form.Label column sm="3">Number</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text" onChange={appNumberOnChange}
                                      className={
                                          errors.validationErrors.includes("number")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a number.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="sourceLocation">
                    <Form.Label column sm="3">Source location</Form.Label>
                    <Col sm="7">
                        <Form.Control onChange={handleAppSourceLocations} as="select"
                                      disabled={items.length > 0 ? true : false}
                                      className={
                                          errors.validationErrors.includes("sourceId")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }>
                            <option hidden>Choose...</option>
                            {warehouses.source.map(f =>
                                <option value={f.id} key={f.id}>{f.identifier}{', '}
                                    {f.addressDto.city}{', '}
                                    {f.addressDto.addressLine1}</option>
                            )}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a value.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="destinationLocation">
                    <Form.Label column sm="3">Destination location</Form.Label>
                    <Col sm="7">
                        <Form.Control onChange={handleAppDestinationLocations} as="select"
                                      className={
                                          errors.validationErrors.includes("destinationId")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }>
                            <option hidden>Choose...</option>
                            {warehouses.destination.map(f =>
                                <option value={f.id} key={f.id}>{f.identifier}{', '}
                                    {f.addressDto.city}{', '}
                                    {f.addressDto.addressLine1}</option>
                            )}

                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a value.
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
                            <Button type="submit" className="mainButton pull-right" onClick={addAppHandler}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default AddShipmentApplication;
