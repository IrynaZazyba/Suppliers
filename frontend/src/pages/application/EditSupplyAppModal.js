import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import {FaTrash} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form'
import ModalApp from "../../components/ModalApp";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import {validateEditItem} from "../../validation/ItemValidationRules";
import {validateEditApplication} from "../../validation/ApplicationValidationRules";

function EditSupplyAppModal(props) {

    const customerId = props.props.customerId;
    const [app, setApp] = useState();
    const [currentItem, setCurrentItem] = useState([]);
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [options, setOptions] = useState([]);
    const filterBy = () => true;
    const ref = React.createRef();
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });
    const [warehouses, setWarehouses] = useState({
        source: [],
        destination: []
    });
    const [deleted, setDeleted] = useState({
        deletedItems: []
    });

    useEffect(() => {
        if (props.props.isOpen === true) {
            Promise.all([
                fetch(`/customers/${customerId}/warehouses/type?type=FACTORY`),
                fetch(`/customers/${customerId}/warehouses/type?type=WAREHOUSE`)
            ]).then(res => Promise.all(res.map(r => r.json())))
                .then(warehouses => {
                    setWarehouses(preState => ({
                        ...preState,
                        source: warehouses[0]
                    }));
                    setWarehouses(preState => ({
                        ...preState,
                        destination: warehouses[1]
                    }));
                });
        }
    }, [props]);


    useEffect(() => {
        if (props.props.isOpen === true) {
            fetch(`/customers/${customerId}/application/${props.props.app.id}`)
                .then(response => response.json())
                .then(res => {
                    calculateTotalValues(res.items);
                    setApp(res);
                });

        }

    }, [props.props.isOpen]);

    const handleSourceLocations = (e) => {
        const value = e.currentTarget.value;
        setApp(preState => ({
            ...preState,
            sourceLocationDto: {id: value}
        }))
    };

    const handleDestinationLocations = (e) => {
        const value = e.currentTarget.value;
        setApp(preState => ({
            ...preState,
            destinationLocationDto: {id: value}
        }))
    };

    const deleteItem = (e) => {
        let afterDelete = [];
        app.items.forEach(i => {
            if (i.itemDto.id != e.currentTarget.id) {
                afterDelete.push(i);
            } else {
                i.deleted = true;
                setDeleted(prevState => ({
                    ...prevState,
                    deletedItems: [...deleted.deletedItems, i]
                }));
            }
        });
        calculateTotalValues(afterDelete);
        setApp(prevState => ({
            ...prevState,
            items: afterDelete
        }));
    };

    const handleInputsAmountAndCost = (fieldName) =>
        (e) => {
            const value = e.target.value;
            setCurrentItem(preState => ({
                ...preState,
                [fieldName]: value
            }))
        };

    const handleSearch = (query) => {
        fetch(`/customers/${customerId}/item/upc?upc=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    upc: i.upc,
                    label: i.label,
                    units: i.units
                }));
                setOptions(optionsFromBack);
            });
    };

    const appNumberOnChange = (e) => {
        const value = e.target.value;
        checkValidationErrors("number");
        setApp(preState => ({
            ...preState,
            number: value
        }))
    };

    const onChangeUpc = (e) => {
        checkValidationErrors("upc");
        checkValidationErrors("exists");
        setErrors({
            setErrors: '',
            validationErrors: []
        });
        e.length > 0 ?
            setCurrentItem(preState => ({
                ...preState,
                id: e[0].id,
                upc: e[0].upc,
                label: e[0].label,
                units: e[0].units
            })) :
            setCurrentItem('');
    };


    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    function calculateTotalValues(items) {
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseInt(i.amount), 0),
                totalUnits: items.reduce((totalUnits, i) => totalUnits + parseFloat(i.itemDto.units) + parseInt(i.amount), 0)
            })
        );
    }

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateEditItem(currentItem, app.items);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {

            setCurrentItem('');
            let dtoItem = {
                cost: currentItem.cost,
                amount: currentItem.amount,
                itemDto: {
                    id: currentItem.id,
                    upc: currentItem.upc,
                    label: currentItem.label,
                    units: currentItem.units
                }
            };
            let afterAdd = [...app.items, dtoItem];
            setApp(prevState => ({
                ...prevState,
                items: afterAdd
            }));
            calculateTotalValues(afterAdd);
            setErrors(prevState => ({
                ...prevState,
                validationErrors: []
            }));
            ref.current.clear();
        }
    };

    const addAppHandler = (e) => {
        e.preventDefault();
        let validErrors = validateEditApplication(app);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));
        if (validErrors.length === 0) {
            let dtoApp = Object.assign({}, app);
            dtoApp.items = [...app.items, ...deleted.deletedItems];
            fetch(`/customers/${customerId}/application/${app.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dtoApp)
            })
                .then(function (response) {
                    if (response.status !== 200) {
                        setErrors({
                            serverErrors: "Something go wrong, try later",
                            validationErrors: ''
                        });
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            validationErrors: []
                        }));
                        setApp('');
                        props.onChange(false, app);
                    }
                });
            setCurrentItem('');
            setDeleted(prevState => ({
                ...prevState,
                deletedItems: []
            }));
        }
    };

    const appData =
        <>
            {app &&
            <Row>
                <Col sm={8}>
                    <Row style={{margin: '10px 5px'}}>
                        <Col><span className="edit-appList">Created by: </span>
                            {app.createdByUsersDto.username + ', ' + app.createdByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Registration date: </span>
                            {app.registrationDate}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px'}}>
                        <Col><span className="edit-appList">Last updated by: </span>
                            {app.lastUpdatedByUsersDto.username + ', ' + app.lastUpdatedByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Last updated date: </span>
                            {app.lastUpdated}
                        </Col>
                    </Row>
                    <Row style={{margin: '20px 5px 10px'}}>
                        <Col>
                            <Form.Group as={Row} controlId="appNumber">
                                <Form.Label column sm="3">Number:</Form.Label>
                                <Col sm="7">
                                    <Form.Control size="sm" type="text" value={app.number} onChange={appNumberOnChange}
                                                  className={
                                                      errors.validationErrors.includes("number")
                                                          ? "form-control is-invalid"
                                                          : "form-control"
                                                  }/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid number.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} controlId="sourceLocation">
                                <Form.Label column sm="3">Source location:</Form.Label>
                                <Col sm="7">
                                    <Form.Control name="sourceId" size="sm" onChange={handleSourceLocations}
                                                  as="select">
                                        {warehouses && warehouses.source.map(f =>
                                            <option value={f.id} key={f.id}
                                                    selected={f.id === app.sourceLocationDto.id}>
                                                {f.identifier}{', '}
                                                {f.addressDto.city}{', '}
                                                {f.addressDto.addressLine1}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} controlId="destinationLocation">
                                <Form.Label column sm="3">Destination location:</Form.Label>
                                <Col sm="7">
                                    <Form.Control name="destinationLocationId" size="sm"
                                                  onChange={handleDestinationLocations} as="select">
                                        {warehouses && warehouses.destination.map(f =>
                                            <option value={f.id} key={f.id}
                                                    selected={f.id === app.destinationLocationDto.id}>
                                                {f.identifier}{', '}
                                                {f.addressDto.city}{', '}
                                                {f.addressDto.addressLine1}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
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
                                <h3>{totalValues.totalUnits}</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            }
        </>;

    const itemsTable =
        <React.Fragment>
            {app && app.items && app.items.length > 0 &&
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Cost</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {app.items.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.itemDto.upc}</td>
                        <td>{i.itemDto.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.cost}</td>
                        <td style={{textAlign: 'center'}}>
                            <FaTrash id={i.itemDto.id} style={{color: '#1A7FA8'}}
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
                        size="sm"
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
                    <Form.Control name="label" size="sm" disabled placeholder="label" type="text"
                                  value={currentItem && currentItem.label}/>
                </Col>
                <Col>
                    <Form.Control name="amount" size="sm" placeholder="amount" type="number" min='1'
                                  value={currentItem && currentItem.amount}
                                  onChange={handleInputsAmountAndCost('amount')}
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
                    <Form.Control size="sm" name="cost" placeholder="cost" type="number" min='1'
                                  value={currentItem && currentItem.cost}
                                  onChange={handleInputsAmountAndCost('cost')}
                                  className={
                                      errors.validationErrors.includes("cost")
                                          ? "form-control is-invalid"
                                          : "form-control"
                                  }/>
                    <Form.Control.Feedback type="invalid">
                        Please provide a value.
                    </Form.Control.Feedback>
                </Col>
                <Col sm="1">
                    <Button size="sm" id={currentItem && currentItem.id} type="submit"
                            variant="outline-primary"
                            className="primaryButton"
                            onClick={addItemHandler}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
        </>;

    const addButton = <Button type="submit" className="mainButton pull-right" onClick={addAppHandler}>Save</Button>;

    return (
        <>
            <ModalApp
                isOpen={props}
                title={"Edit supply application"}
                itemsTable={itemsTable}
                appDataFields={appData}
                status={app && app.applicationStatus.replace('_', ' ').toLowerCase()}
                inputsAddItems={inputsAddItems}
                setErrors={setErrors}
                setApp={setApp}
                errors={errors}
                button={addButton}
                setCurrentItem={setCurrentItem}
                setUnavailableItems={''}
                unavailableItems={''}
            />
        </>
    );

}

export default EditSupplyAppModal;
