import ErrorMessage from "../../messages/errorMessage";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {checkCarCapacity} from "../../validation/WaybillValidationRules";

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
    const [waybill, setWaybill] = useState({});
    const [apps, setApps] = useState([]);


    useEffect(() => {
        if (props.modal.isOpen) {
            Promise.all([
                fetch(`/customers/${customerId}/car`),
                fetch(`/customers/${customerId}/users/role?role=ROLE_DRIVER`),
                fetch(`/customers/${customerId}/waybills/${props.modal.waybillId}`),
              //  fetch(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto.id}&applicationStatus=OPEN&size=5`)
            ]).then(res => Promise.all(res.map(r => r.json())))
                .then(content => {
                    setCars(content[0].content);
                    setDrivers(content[1]);
                    setWaybill(content[2]);
                    let totalAmount = content[2].applications
                        .reduce((total, app) => total + app.items.reduce((t, i) => t + i.amount, 0), 0);
                    let totalUnits = content[2].applications
                        .reduce((total, app) => total + app.items.reduce((t, i) => t + (i.amount * i.itemDto.units), 0), 0);
                    setTotalValues({
                        totalAmount: totalAmount,
                        totalUnits: totalUnits,
                        carCapacity: content[2].car.currentCapacity
                    });


                });
        }
    }, [props.modal]);


    const numberHandler = (e) => {
        e.preventDefault();
        setWaybill(prevState => ({
            ...prevState,
            number: e.target.value
        }));
    };

    const driverHandler = (e) => {
        e.preventDefault();
        setWaybill(prevState => ({
            ...prevState,
            driver: {id: e.target.value}
        }));
    };

    const carHandler = (e) => {
        e.preventDefault();
        let carId = e.target.value;
        setWaybill(prevState => ({
            ...prevState,
            car: {id: carId}
        }));
        let car = cars.find(car => car.id == carId);
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
    };


    const addButton = <Button type="submit"
                              className="mainButton pull-right waybill-button"
        //onClick={saveWaybillHandler}
    >Save</Button>;

    const calculateRouteButton = <Button type="submit" className="mainButton pull-right waybill-button"
        //onClick={calculateOptimalRoute}
    >Introduce route</Button>;

    const waybillInfo =
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
                                      value={waybill.sourceLocationWarehouseDto.identifier + ', ' +
                                      waybill.sourceLocationWarehouseDto.addressDto.addressLine1 + ', ' +
                                      waybill.sourceLocationWarehouseDto.addressDto.addressLine2}/>
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
                                <option key={car.id} value={car.id}
                                        selected={waybill.car.id === car.id}>
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
                                <option key={driver.id} value={driver.id}
                                        selected={waybill.driver.id === driver.id}>
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
                    {waybillContentData}
                    <Card border="primary" style={{width: '100%', marginTop: '5px'}}>
                        <Card.Header>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                            </Card.Text>
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
