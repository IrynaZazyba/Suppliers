import React, {useContext, useEffect, useState} from "react";
import ErrorMessage from "../../messages/errorMessage";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import Table from "react-bootstrap/Table";
import {FaMinus, FaPlus} from "react-icons/fa";
import Page from "../../components/Page";
import Button from "react-bootstrap/Button";
import validateWaybill, {checkCarCapacity} from "../../validation/WaybillValidationRules";

function AddWaybillModal(props) {

    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [sourceWarehouse, setSourceWarehouse] = useState([]);
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: 0,
        totalUnits: 0,
        carCapacity: 0
    });
    const [apps, setApps] = useState([]);
    const [addedApps, setAddedApps] = useState([]);
    const [waybill, setWaybill] = useState({
        number: '',
        source: '',
        car: '',
        driver: '',
        apps: [],
    });
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 5,
        countPages: 1
    });


    useEffect(() => {
        Promise.all([
            fetch(`/customers/${customerId}/warehouses/applications`),
            fetch(`/customers/${customerId}/car`),
            fetch(`/customers/${customerId}/users/role?role=ROLE_DRIVER`),
        ]).then(res => Promise.all(res.map(r => r.json())))
            .then(content => {
                setSourceWarehouse(content[0]);
                setCars(content[1].content);
                setDrivers(content[2]);
            });
    }, [props.modal]);

    useEffect(() => {
        if (addedApps.length > 0) {
            let waybillApps = apps.filter(a => addedApps.includes(a.id));
            let totalAmount = waybillApps.reduce((total, app) => total + app.items.reduce((t, i) => t + i.amount, 0), 0);
            let totalUnits = waybillApps.reduce((total, app) => total + app.items.reduce((t, i) => t + (i.amount * i.itemDto.units), 0), 0);
            setTotalValues(prevState => ({
                ...prevState,
                totalAmount: totalAmount,
                totalUnits: totalUnits
            }));

            checkValidationErrors('capacity');
            let validRes = checkCarCapacity(totalValues.carCapacity, totalUnits);
            setErrors(prevState => ({
                ...prevState,
                validationErrors: [...errors.validationErrors, ...validRes]
            }));
        }
    }, [addedApps]);


    const numberHandler = (e) => {
        e.preventDefault();
        checkValidationErrors('number');
        setWaybill(prevState => ({
            ...prevState,
            number: e.target.value
        }));
    };

    function getApps(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setApps(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const sourceLocationHandler = (e) => {
        e.preventDefault();
        checkValidationErrors('source');
        let sourceId = e.target.value;
        getApps(`/customers/${customerId}/application/warehouses?warehouseId=${sourceId}&applicationStatus=OPEN&size=5`);
        setWaybill(prevState => ({
            ...prevState,
            source: sourceId
        }));
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.source}&applicationStatus=OPEN&page=${currentPage}&size=5`);
    };

    const driverHandler = (e) => {
        e.preventDefault();
        checkValidationErrors('driver');
        setWaybill(prevState => ({
            ...prevState,
            driver: e.target.value
        }));
    };

    const carHandler = (e) => {
        e.preventDefault();
        checkValidationErrors('car');
        let carId = e.target.value;
        setWaybill(prevState => ({
            ...prevState,
            driver: e.target.value
        }));
        let car = cars.find(car => car.id == carId);
        setTotalValues(prevState => ({
            ...prevState,
            carCapacity: car.currentCapacity
        }));
        let validRes = checkCarCapacity(car.currentCapacity, totalValues.totalUnits);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: [...errors.validationErrors, ...validRes]
        }));
    };

    const waybillInfo =
        <React.Fragment>
            <Form.Group controlId="number">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Number</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control size="sm" type="text"
                                      onChange={numberHandler}
                                      className={
                                          errors.validationErrors.includes("number")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid value.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group controlId="sourceLocation">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Source location</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control disabled={addedApps.length > 0}
                                      defaultValue="Choose..."
                                      htmlSize={3}
                                      as="select" size="sm" drop="down"
                                      onChange={sourceLocationHandler}
                                      className={
                                          errors.validationErrors.includes("source")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }
                        >
                            <option hidden>Choose...</option>
                            {sourceWarehouse.map(warehouse => (
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.identifier}, {warehouse.addressDto.city}, {warehouse.addressDto.addressLine1}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a value.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group controlId="cars">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Car</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control as="select" size="sm" drop="down"
                                      htmlSize={3}
                                      style={{width: '100%'}}
                                      onChange={carHandler}
                                      className={
                                          errors.validationErrors.includes("car")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }
                        >
                            <option hidden>Choose...</option>
                            {cars.map(car => (
                                <option key={car.id} value={car.id}>
                                    {car.number}, {car.addressDto.addressLine1}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a value.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group controlId="cars">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Driver</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control as="select" size="sm" drop="down"
                                      htmlSize={2}
                                      style={{width: '100%'}}
                                      onChange={driverHandler}
                                      className={
                                          errors.validationErrors.includes("driver")
                                              ? "form-control is-invalid"
                                              : "form-control"
                                      }>
                            <option hidden>Choose...</option>
                            {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.username}, {driver.surname}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a value.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
            </Form.Group>
        </React.Fragment>;


    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{lat: -34.397, lng: 150.644}}>
            <Marker position={{lat: -34.397, lng: 150.644}}/>
        </GoogleMap>
    ));


    const addAppToWaybill = (e) => {
        e.preventDefault();
        checkValidationErrors('apps');
        let appId = e.currentTarget.id;
        setAddedApps([...addedApps, parseInt(appId)]);
    };

    const saveWaybillHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWaybill(waybill, addedApps);
        if (validationResult.length === 0) {

        } else {
            setErrors(prevState => ({
                ...prevState,
                validationErrors: validationResult
            }))
        }
    };


    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    const removeAppFromWaybill = (e) => {
        e.preventDefault();
        let appId = parseInt(e.currentTarget.id);
        let result = addedApps.filter(app => app !== appId);
        setAddedApps(result);
    };


    const appRows =
        <React.Fragment>
            {apps && apps.map(app => (
                <tr key={app.id} className={addedApps.includes(app.id) ? 'waybill-app' : ''}>
                    <td>{addedApps.includes(app.id) ?
                        <FaMinus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}
                                 size={'1.0em'}
                                 onClick={removeAppFromWaybill}/> :
                        <FaPlus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}
                                size={'1.0em'}
                                onClick={addAppToWaybill}/>
                    }

                    </td>
                    <td className="table-text-center">{app.number}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + i.amount, 0)}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + (i.amount * i.itemDto.units), 0)}</td>
                    <td style={{fontSize: '0.9rem', width: '35%'}}>{app.destinationLocationDto.addressDto.city}{', '}
                        {app.destinationLocationDto.addressDto.addressLine1}{', '}
                        {app.destinationLocationDto.addressDto.addressLine2}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + i.cost, 0)}</td>
                </tr>
            ))}
        </React.Fragment>;

    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                <tr>
                    <th></th>
                    <th className="table-text-center">Number</th>
                    <th className="table-text-center">Total amount of item</th>
                    <th className="table-text-center">Total units</th>
                    <th>Destination location</th>
                    <th className="table-text-center">Total cost, $</th>
                </tr>
                </thead>
                <tbody>
                {appRows}
                </tbody>
            </Table>
            <Page page={page} onChange={changePage}/>
        </React.Fragment>;


    const waybillContentData =
        <React.Fragment>
            <Row>
                <Col sm={6}>
                    {waybillInfo}

                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={3} className="waybill-card">
                            <Card className="total-card">
                                <Card.Body>
                                    <h6>Total amount of items</h6>
                                    <Card.Text>
                                        <h3>{totalValues.totalAmount}</h3>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={3} className="waybill-card">
                            <Card className="total-card">
                                <Card.Body>
                                    <h6>Total number of units</h6>
                                    <Card.Text>
                                        <h3>{totalValues.totalUnits}</h3>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={3} className="waybill-card">
                            <Card className="total-card">
                                <Card.Body
                                    className={errors.validationErrors.includes('capacity') ? "car-capacity-attention" : ''}>
                                    <h6>Available car capacity</h6>
                                    <Card.Text>
                                        <h3> {totalValues.carCapacity}</h3>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>;

    const addButton = <Button type="submit" className="mainButton pull-right"
                              onClick={saveWaybillHandler}
    >Save</Button>;


    return (
        <>
            <Modal
                show={props.modal}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    setPage({
                        active: 1,
                        currentPage: 1,
                        countPerPage: 5,
                        countPages: 1
                    });
                    setWaybill({});
                    setAddedApps([]);
                    setApps([]);
                    setTotalValues({
                        carCapacity: 0,
                        totalAmount: 0,
                        totalUnits: 0
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="waybill-modal"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create waybill
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    {waybillContentData}
                    <div className="validation-error">
                        {errors.validationErrors.includes("apps") ? "Apps should be specified" : ""}
                    </div>
                    <Card border="primary" style={{width: '100%', marginTop: '5px'}}>
                        <Card.Header>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                            </Card.Text>
                            {apps.length > 0 && body}
                        </Card.Body>
                    </Card>
                    <div className="float-right" style={{padding: '10px'}}>
                        {addButton}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddWaybillModal;
