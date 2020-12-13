import ModalApp from "../../components/ModalApp";
import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {FaTrash} from "react-icons/fa";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import {validateEditApplication} from "../../validation/ApplicationValidationRules";
import calculateItemPrice, {calculateDistance, recalculateItemWhenChangeWarehouse} from "./CalculatePrice";
import {checkItemsAtWarehouse, validateShipmentEditItem} from "../../validation/ItemValidationRules";

function EditShipmentModal(props) {

    const [app, setApp] = useState();
    const [currentItem, setCurrentItem] = useState([]);
    const customerId = props.props.customerId;
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [warehouses, setWarehouses] = useState({
        source: [],
        destination: []
    });
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });
    const [options, setOptions] = useState([]);
    const [deleted, setDeleted] = useState({
        deletedItems: []
    });
    const filterBy = () => true;
    const ref = React.createRef();
    const [taxes, setTaxes] = useState();
    const [unavailableItems, setUnavailableItems] = useState();

    useEffect(() => {
        if (props.props.isOpen === true) {

            Promise.all([
                fetch(`/customers/${customerId}/warehouses/type?type=WAREHOUSE`),
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

    function calculateTotalValues(items) {
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseFloat(i.amount), 0),
                totalUnits: items.reduce((totalUnits, i) => totalUnits + parseFloat(i.itemDto.units) * parseFloat(i.amount), 0)
            })
        );
    }

    const handleSearch = (query) => {
        fetch(`/customers/${customerId}/warehouses/${app.sourceLocationDto.id}/items?itemUpc=${query}`)
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

    const handleSourceLocations = (e) => {
        const value = e.currentTarget.value;
        let itemsId = app.items.map(i => i.itemDto.id);
        recalculateItemsPrice(itemsId, value, app.destinationLocationDto.id);
    };

    const handleDestinationLocations = (e) => {
        const value = e.currentTarget.value;
        let itemsId = app.items.map(i => i.itemDto.id);
        recalculateItemsPrice(itemsId, app.sourceLocationDto.id, value);
    };

    function recalculateItemsPrice(itemsId, sourceId, destinationId) {
        fetch(`/customers/${customerId}/warehouses/${sourceId}/warehouse-items?itemsId=${itemsId}`)
            .then(response => response.json())
            .then(res => {
                let unavailable = checkItemsAtWarehouse(itemsId, res);
                setUnavailableItems(unavailable);
                let recalculatedApp = recalculateItemWhenChangeWarehouse(
                    Object.assign({}, app), sourceId, destinationId, taxes, res, warehouses);
                setApp(recalculatedApp);
            });
    }


    const handleInputsAmount = (e) => {
        const value = e.target.value;
        checkValidationErrors("amount");
        setCurrentItem(preState => ({
            ...preState,
            amount: value
        }))
    };

    const appNumberOnChange = (e) => {
        const value = e.target.value;
        setErrors(prevState => ({
            ...prevState,
            serverErrors: ''
        }));
        setApp(preState => ({
            ...preState,
            number: value
        }))
    };

    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

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
                units: e[0].units,
                category: e[0].category,
                cost: e[0].cost
            })) :
            setCurrentItem('');
    };


    const deleteItem = (e) => {
        let afterDelete = [];
        app.items.forEach(i => {
            if (i.itemDto.id != e.currentTarget.id) {
                afterDelete.push(i);
            } else {
                if (i.id) {
                    i.deleted = true;
                    setDeleted(prevState => ({
                        ...prevState,
                        deletedItems: [...deleted.deletedItems, i]
                    }));
                }
            }
        });

        //remove deleted item from unavailable items
        if (unavailableItems) {
            let unavailableItemAfterDeletingItem = unavailableItems.filter(i => i != e.currentTarget.id);
            setUnavailableItems(unavailableItemAfterDeletingItem);
        }

        calculateTotalValues(afterDelete);
        setApp(prevState => ({
            ...prevState,
            items: afterDelete
        }));
    };

    const addItemHandler = (e) => {
        e.preventDefault();
        let validationResult = validateShipmentEditItem(currentItem, app.items, app);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validationResult
        }));
        if (validationResult.length === 0) {
            let dtoItem = {
                cost: currentItem.price,
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
            setCurrentItem('');
        }
    };

    const addAppHandler = (e) => {
        e.preventDefault();
        let validErrors = validateEditApplication(app);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: validErrors
        }));
        if (validErrors.length === 0 && (!unavailableItems || unavailableItems && unavailableItems.length === 0)) {
            let dtoApp = Object.assign({}, app);
            dtoApp.items = [...app.items, ...deleted.deletedItems];

            fetch(`/customers/${customerId}/application/${app.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dtoApp)
            })
                .then(response => {
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
                        setErrors({
                            serverErrors:'',
                            validationErrors: []
                        });
                        setApp('');
                        setCurrentItem('');
                        setDeleted(prevState => ({
                            ...prevState,
                            deletedItems: []
                        }));
                        props.onChange(false, app);
                    }
                });

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
                                                  disabled={unavailableItems && unavailableItems.length !== 0 && true}
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
            <Table bordered size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Cost, $ per item</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {app.items.map(i => (
                    <tr id={i.id} key={i.id}
                        className={unavailableItems && unavailableItems.includes(i.itemDto.id) && "unavailable-item"}>
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
                                  onChange={handleInputsAmount}
                                  onBlur={() => {
                                      let sourceId = app.sourceLocationDto.id;
                                      let destinationId = app.destinationLocationDto.id;
                                      let distance = calculateDistance(warehouses, sourceId, destinationId);
                                      let itemPrice = calculateItemPrice(currentItem, taxes, distance, destinationId);
                                      setCurrentItem(prevState => ({
                                          ...prevState,
                                          price: itemPrice
                                      }));
                                  }
                                  }
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
                                  value={currentItem && currentItem.price}
                                  disabled
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
                title={"Edit shipment application"}
                itemsTable={itemsTable}
                appDataFields={appData}
                status={app && app.applicationStatus.replace('_', ' ').toLowerCase()}
                inputsAddItems={inputsAddItems}
                setErrors={setErrors}
                setApp={setApp}
                errors={errors}
                button={addButton}
                setCurrentItem={setCurrentItem}
                setUnavailableItems={setUnavailableItems}
                unavailableItems={unavailableItems}
            />
        </>
    );

}

export default EditShipmentModal;