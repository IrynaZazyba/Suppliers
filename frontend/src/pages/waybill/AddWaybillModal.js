import React, {useContext, useEffect, useState} from "react";
import ErrorMessage from "../../messages/errorMessage";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

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

    useEffect(() => {
        fetch(`/customers/${customerId}/warehouses/applications`)
            .then(response => response.json())
            .then(commits => {
                setSourceWarehouse(commits);
            });
        fetch(`/customers/${customerId}/car`)
            .then(response => response.json())
            .then(commits => {
                setCars(commits.content);
            });
        fetch(`/customers/${customerId}/users/role?role=ROLE_DRIVER`)
            .then(response => response.json())
            .then(commits => {
                setDrivers(commits);
            });
    }, [props.modal]);


    const waybillContentData =
        <React.Fragment>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="number">
                        <Form.Row>
                            <Col sm={4}>
                                <Form.Label>Number</Form.Label>
                            </Col>
                            <Col sm={8}>
                                <Form.Control size="sm" type="text" placeholder="number"/>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group controlId="sourceLocation">
                        <Form.Row>
                            <Col sm={4}>
                                <Form.Label>Source location</Form.Label>
                            </Col>
                            <Col sm={8}>
                                <Form.Control as="select" size="sm" drop="down"
                                              onFocus={(e) => {
                                                  e.target.size = 5
                                              }}
                                              onBlur={(e) => {
                                                  {
                                                      e.target.size = 1
                                                  }
                                              }}
                                              onChange={(e) => {
                                                  e.target.blur()
                                              }}
                                >
                                    {sourceWarehouse.map(warehouse => (
                                        <option key={warehouse.id}>
                                            {warehouse.identifier}, {warehouse.addressDto.city}, {warehouse.addressDto.addressLine1}
                                        </option>
                                    ))}
                                </Form.Control>
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
                                              onFocus={(e) => {
                                                  e.target.size = 5
                                              }}
                                              onBlur={(e) => {
                                                  {
                                                      e.target.size = 1
                                                  }
                                              }}
                                              onChange={(e) => {
                                                  e.target.blur()
                                              }}
                                >
                                    {cars.map(car => (
                                        <option key={car.id}>
                                            {car.number}, {car.addressDto.addressLine1}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group controlId="cars">
                        <Form.Row>
                            <Col sm={4}>
                                <Form.Label>Driver</Form.Label>
                            </Col>
                            <Col sm={8}>
                                <Form.Control as="select" size="sm" drop="down">
                                    {drivers.map(driver => (
                                        <option key={driver.id}>
                                            {driver.username}, {driver.surname}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
                <Col sm={6}>

                </Col>
            </Row>
        </React.Fragment>;

    return (
        <>
            <Modal
                show={props.modal}
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
                        Create waybill
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    {waybillContentData}
                    <Card border="primary" style={{width: '100%'}}>
                        <Card.Header>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Form>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddWaybillModal;
