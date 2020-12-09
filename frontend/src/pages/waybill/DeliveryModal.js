import ErrorMessage from "../../messages/errorMessage";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import React, {useContext, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import Badge from "react-bootstrap/Badge";

function DeliveryModal(props) {

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;
    const [waybill, setWaybill] = useState();

    useEffect(() => {
        if (props.modal.isOpen === true) {
            fetch(`/customers/${customerId}/waybills/${props.modal.waybillId}`)
                .then(response => response.json())
                .then(res => {
                    setWaybill(res);
                });
        }
    }, [props.modal]);

    const waybillInfo =
        <>
            {waybill &&
            <Row>
                <Col sm={8}>
                    <Row style={{margin: '10px 5px'}}>
                        <Col>
                            <span className="edit-appList">Number: </span> {waybill.number}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px'}}>
                        <Col><span className="edit-appList">Created by: </span>
                            {waybill.createdByUsersDto.username + ', ' + waybill.createdByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Registration date: </span>
                            {waybill.registrationDate}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px'}}>
                        <Col><span className="edit-appList">Last updated by: </span>
                            {waybill.updatedByUsersDto.username + ', ' + waybill.updatedByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Last updated date: </span>
                            {waybill.lastUpdated}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px', paddingBottom: '15px'}}>
                        <Col><span className="edit-appList">Driver: </span>
                            {waybill.driver.name + ' ' + waybill.driver.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Car: </span>
                            {waybill.car.number}{' '}
                            <Badge pill variant={waybill.car.onTheWay ? 'danger' : 'success'}>
                                {waybill.car.onTheWay ? 'On the way' : 'Free'}
                            </Badge>
                        </Col>
                    </Row>
                </Col>
                <Col sm={4}>

                </Col>
            </Row>
            }
        </>;


    return (
        <>
            <Modal
                show={props.modal.isOpen}
                onHide={() => {
                    props.onChange(false)
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="waybill-modal"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">Delivery </Modal.Title>
                    <div className="badge-delivery-modal">
                        <h4><Badge className="badge-status status-in-modal">
                            {waybill && waybill.waybillStatus}
                        </Badge>
                        </h4>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    {waybillInfo}
                    <Card>
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
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DeliveryModal;