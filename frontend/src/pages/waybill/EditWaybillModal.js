import ErrorMessage from "../../messages/errorMessage";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {checkCarCapacity, validateCar, validateDriver} from "../../validation/WaybillValidationRules";
import {Typeahead} from "react-bootstrap-typeahead";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import {FaMinus, FaPlus} from "react-icons/fa";

function EditWaybillModal(props) {

    const customerId = props.modal.customerId;
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [totalValues, setTotalValues] = useState({
        totalAmount: 0,
        totalUnits: 0,
        carCapacity: 0
    });
    const [waybill, setWaybill] = useState([]);
    const [apps, setApps] = useState([]);
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 5,
        countPages: 1
    });

    useEffect(() => {
        if (props.modal.isOpen) {
            Promise.all([
                fetch(`/customers/${customerId}/car`),
                fetch(`/customers/${customerId}/users/role?role=ROLE_DRIVER`),
                fetch(`/customers/${customerId}/waybills/${props.modal.waybillId}`)
            ]).then(res => Promise.all(res.map(r => r.json())))
                .then(content => {
                    setCars(content[0].content);
                    setDrivers(content[1]);
                    let waybill = content[2];
                    setWaybill(waybill);
                    calculateTotalValues(waybill);

                    getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto.id}&applicationStatus=OPEN&page=${page.currentPage}&size=5`);

                });
        }
    }, [props.modal]);

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

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto.id}&applicationStatus=OPEN&page=${currentPage}&size=5`);
    };

    function calculateTotalValues(waybill) {
        let totalAmount = waybill.applications
            .reduce((total, app) => total + app.items.reduce((t, i) => t + i.amount, 0), 0);
        let totalUnits = waybill.applications
            .reduce((total, app) => total + app.items.reduce((t, i) => t + (i.amount * i.itemDto.units), 0), 0);
        setTotalValues({
            totalAmount: totalAmount,
            totalUnits: totalUnits,
            carCapacity: waybill.car.currentCapacity
        });
    }


    const numberHandler = (e) => {
        e.preventDefault();
        setWaybill(prevState => ({
            ...prevState,
            number: e.target.value
        }));
    };

    const driverHandler = (e) => {
        let validationRes = validateDriver(e);
        if (validationRes.length === 0) {
            checkValidationErrors('driver');
            setWaybill(prevState => ({
                ...prevState,
                driver: e[0]
            }));
        } else {
            setWaybill(prevState => ({
                ...prevState,
                driver: ''
            }));
            setErrors(prevState => ({
                ...prevState,
                validationErrors: [...errors.validationErrors, ...validationRes]
            }));
        }
    };


    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    const carHandler = (e) => {
        let validationRes = validateCar(e);
        if (validationRes.length === 0) {
            checkValidationErrors('car');
            let car = e[0];
            setWaybill(prevState => ({
                ...prevState,
                car: car
            }));
            setTotalValues(prevState => ({
                ...prevState,
                carCapacity: car.currentCapacity
            }));
            let res = errors.validationErrors.filter(e => e != 'car' && e != 'capacity');
            let validRes = checkCarCapacity(car.currentCapacity, totalValues.totalUnits);
            setErrors(prevState => ({
                ...prevState,
                validationErrors: [...res, ...validRes]
            }));
        } else {
            setWaybill(prevState => ({
                ...prevState,
                car: ''
            }));
            setTotalValues(prevState => ({
                ...prevState,
                carCapacity: 0
            }));
            setErrors(prevState => ({
                ...prevState,
                validationErrors: [...errors.validationErrors, ...validationRes]
            }));
        }
    };


    const addButton = <Button type="submit"
                              className="mainButton pull-right waybill-button"
        //onClick={saveWaybillHandler}
    >Save</Button>;

    const calculateRouteButton = <Button type="submit" className="mainButton pull-right waybill-button"
        //onClick={calculateOptimalRoute}
    >Introduce route</Button>;

    const waybillInfo =
        <>{waybill &&
        <React.Fragment>
            <Form.Group controlId="number">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Number</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control size="sm" type="text"
                                      value={waybill.number}
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
                        <Form.Control size="sm" type="text" disabled
                            value={waybill.sourceLocationWarehouseDto.identifier}
                        />
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group controlId="cars">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Car</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Typeahead
                            defaultSelected={cars.filter(car => car.id == waybill.car.id)}
                            id="basic-example"
                            labelKey={option => `${option.number}, ${option.addressDto.addressLine1}, ${option.addressDto.addressLine2}`}
                            onChange={carHandler}
                            options={cars}
                            placeholder="Choose value..."
                        >
                            <div className="validation-error">
                                {errors.validationErrors.includes("car") ? "Please provide a value" : ""}
                            </div>
                        </Typeahead>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group controlId="cars">
                <Form.Row>
                    <Col sm={4}>
                        <Form.Label>Driver</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Typeahead
                            defaultSelected={drivers.filter(driver => driver.id == waybill.driver.id)}
                            id="basic-example"
                            labelKey={option => `${option.surname}, ${option.username}`}
                            onChange={driverHandler}
                            options={drivers}
                            placeholder="Choose value..."
                        >
                            <div className="validation-error">
                                {errors.validationErrors.includes("driver") ? "Please provide a value" : ""}
                            </div>
                        </Typeahead>
                    </Col>
                </Form.Row>
            </Form.Group>
        </React.Fragment>
        }</>;

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

    const appRows =
        <React.Fragment>
            {apps && apps.map(app => (
                <tr key={app.id}
                    //className={addedApps.includes(app.id) ? 'waybill-app' : ''}
                >
                    <td>
                    {/*    {addedApps.includes(app.id) ?*/}
                    {/*    <FaMinus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}*/}
                    {/*             size={'1.0em'}*/}
                    {/*             //onClick={removeAppFromWaybill}*/}
                    {/*    /> :*/}
                    {/*    <FaPlus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}*/}
                    {/*            size={'1.0em'}*/}
                    {/*           // onClick={addAppToWaybill}*/}
                    {/*    />*/}
                    {/*}*/}
                    </td>
                    <td className="table-text-center">{app.number}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + i.amount, 0)}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + (i.amount * i.itemDto.units), 0)}</td>
                    <td style={{fontSize: '0.9rem', width: '37%'}}>{app.destinationLocationDto.addressDto.city}{', '}
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

    return (
        <>
            <Modal
                show={props.modal.isOpen}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
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
                        Edit waybill
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    {errors.validationErrors.includes("route") &&
                    <ErrorMessage message="To calculate route choose applications"/>}
                    {errors.validationErrors.includes("introduce-route") &&
                    <ErrorMessage message="Please, calculate route"/>}
                    <div className="validation-error">
                        {errors.validationErrors.includes("apps") ? "Apps should be specified" : ""}
                    </div>
                    {waybill.sourceLocationWarehouseDto && waybillContentData}
                    <Card border="primary" style={{width: '100%', marginTop: '5px'}}>
                        <Card.Header>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                            </Card.Text>
                            {apps.length > 0 && body}
                        </Card.Body>
                    </Card>

                    <Row style={{marginTop: '15px'}}>
                        <Col sm={6}>
                        </Col>
                        <Col sm={6}>
                        </Col>
                    </Row>
                    <div className="float-right" style={{padding: '10px'}}>
                        {calculateRouteButton}{addButton}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default EditWaybillModal;
