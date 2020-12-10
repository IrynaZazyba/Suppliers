/*global google*/
/* eslint-disable no-undef */
import ErrorMessage from "../../messages/errorMessage";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import React, {useContext, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import Badge from "react-bootstrap/Badge";
import MyMapComponent from "../../components/MyMapComponent";
import ListGroup from "react-bootstrap/ListGroup";
import {FaCheck, FaFlag, FaRegSquare} from "react-icons/fa";
import Button from "react-bootstrap/Button";

function DeliveryModal(props) {

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;
    const [waybill, setWaybill] = useState();
    const [mapCenter, setMapCenter] = useState({lat: 51.494900, lng: -0.146231});
    const [directions, setDirections] = useState();
    const [waypoints, setWaypoints] = useState([]);
    const [startPoint, setStartPoint] = useState();
    const [blockedPoints, setBlockedPoints] = useState([]);

    useEffect(() => {
        if (props.modal.isOpen === true) {
            fetch(`/customers/${customerId}/waybills/${props.modal.waybillId}`)
                .then(response => response.json())
                .then(res => {
                    let blockedPointId = res.route.wayPoints.filter(point => point.priority !== 1).map(p => p.id);
                    setBlockedPoints(blockedPointId);
                    setWaybill(res);
                    let route = res.route;
                    let countPoints = route.wayPoints.length;
                    let points = route.wayPoints.filter(wp => (wp.priority !== 0 && wp.priority !== (countPoints - 1)));
                    let endPoint = route.wayPoints.filter(wp => wp.priority === (countPoints - 1));
                    let startPoint = route.wayPoints.filter(wp => wp.priority === 0);
                    setMapCenter({lat: startPoint[0].address.latitude, lng: startPoint[0].address.longitude});
                    let waypoints = points.map(wp => {
                        return {
                            location: {
                                lat: wp.address.latitude,
                                lng: wp.address.longitude
                            },
                            stopover: true
                        }
                    });
                    let waypointsWithEnd = [...points, ...endPoint];
                    setWaypoints(waypointsWithEnd);
                    setStartPoint(startPoint[0]);
                    let start = {lat: startPoint[0].address.latitude, lng: startPoint[0].address.longitude};
                    let end = {
                        lat: endPoint[0].address.latitude,
                        lng: endPoint[0].address.longitude
                    };
                    renderRoute(start, end, waypoints);
                });
        }
    }, [props.modal]);

    const setVisited = (e) => {
        e.preventDefault();
        let wayPointId = parseInt(e.target.id);
        if (!blockedPoints.includes(wayPointId)) {
            let points = JSON.parse(JSON.stringify(waypoints));
            points.forEach(wp => {
                    if (wp.id === wayPointId) {
                        wp.visited = true;
                    }
                }
            );
            setWaypoints(points);
            let blocked = blockedPoints.slice();
            blocked.push(wayPointId);
            let afterRemove = blocked.filter(id => id !== (wayPointId + 1));
            setBlockedPoints(afterRemove);
        }
    };


    function renderRoute(start, end, waypoints) {
        const directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();

        let requests = {
            origin: start,
            destination: end,
            waypoints: waypoints,
            travelMode: 'DRIVING'
        };
        directionsService.route(requests, function (result, status) {
            if (status == 'OK') {
                setDirections(result);
                directionsRenderer.setDirections(result);
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    serverErrors: "Something went wrong, please try later",
                }));
            }
        });
    }


    const isVisited = (wp) => {
        return wp.visited ? <FaCheck id={wp.id}
                                     style={{marginRight: '5px', textAlign: 'center', color: 'green'}}
                                     size={'1.5em'}/> :
            <FaRegSquare id={wp.id}
                         style={{
                             marginRight: '5px',
                             textAlign: 'center',
                             color: '#1A7FA8'
                         }}
                         size={'1.4em'}
                         onClick={setVisited}/>;
    };

    const startDelivery = <Button type="submit" className="delivery-button"
        //onClick={startDelivery}
    >Start delivery</Button>;

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
                    {startDelivery}
                </Col>
            </Row>
            }
        </>;

    const map =
        <MyMapComponent
            mapCenter={mapCenter}
            directions={directions}
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap&libraries=geometry,drawing,places"
            loadingElement={<div style={{height: `100%`}}/>}
            containerElement={<div style={{height: `350px`}}/>}
            mapElement={<div style={{height: `100%`}}/>}

        />;

    return (
        <>
            <Modal
                show={props.modal.isOpen}
                onHide={() => {
                    setBlockedPoints([]);
                    setWaypoints([]);
                    setWaybill();
                    setDirections([]);
                    setStartPoint();
                    setErrors([]);
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
                            {map}
                        </Col>
                        <Col id="google-panel" sm={6}>
                            <ListGroup variant="flush">
                                {startPoint && <ListGroup.Item key={startPoint.id}>
                                    <FaFlag id={startPoint.id}
                                            style={{marginRight: '5px', textAlign: 'center', color: 'green'}}
                                            size={'1.5em'}/>
                                    {startPoint.address.state.state}, {startPoint.address.city}, {startPoint.address.addressLine1}, {startPoint.address.addressLine2}
                                </ListGroup.Item>}
                                {waypoints.sort((a, b) => a.priority - b.priority).map(wp => (
                                    <ListGroup.Item key={wp.id}
                                                    className={blockedPoints.includes(wp.id) ? 'delivery-blocked-waypoint' : ''}>
                                        {isVisited(wp)}
                                        {wp.address.state.state}, {wp.address.city}, {wp.address.addressLine1}, {wp.address.addressLine2}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
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