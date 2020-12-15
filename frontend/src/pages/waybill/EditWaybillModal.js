/*global google*/
/* eslint-disable no-undef */
import ErrorMessage from "../../messages/errorMessage";
import {ListGroup, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
    checkCarCapacity,
    checkIfRouteCalculated,
    checkIfRouteExists,
    validateCar,
    validateDriver,
    validateUpdatedWaybill
} from "../../validation/WaybillValidationRules";
import {Typeahead} from "react-bootstrap-typeahead";
import Table from "react-bootstrap/Table";
import {FaFlag, FaMapMarkerAlt, FaMinus, FaPlus} from "react-icons/fa";
import MyMapComponent from "../../components/MyMapComponent";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";

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
    const [waybill, setWaybill] = useState();
    const [apps, setApps] = useState([]);
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 5,
        countPages: 1
    });
    const [renderApps, setRenderApps] = useState([]);
    const [directions, setDirections] = useState();
    const [waypoints, setWaypoints] = useState([]);
    const [startPoint, setStartPoint] = useState({});
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState({lat: 51.494900, lng: -0.146231});
    const [appsLoading, setAppsLoading] = useState(true);
    const google = window.google = window.google ? window.google : {};


    useEffect(() => {

        if (props.modal.isOpen) {
            Promise.all([
                fetch(`/customers/${customerId}/car/unpaged`),
                fetch(`/customers/${customerId}/users/role?role=ROLE_DRIVER`),
                fetch(`/customers/${customerId}/waybills/${props.modal.waybillId}`)
            ]).then(res => Promise.all(res.map(r => r.json())))
                .then(content => {
                    setCars(content[0].content);
                    setDrivers(content[1]);
                    let waybill = content[2];
                    setWaybill(waybill);
                    calculateTotalValues(waybill);
                    setAppsLoading(false);
                    //calculate route
                    setShowMap(true);
                    if (google) {
                        parseAndRenderRoute(waybill.route.wayPoints);
                    }
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto.id}&size=5&waybillId=${props.modal.waybillId}`);
                })
                .catch(error => setErrors({
                    serverErrors: "Something go wrong, try later",
                    validationErrors: []
                }));
        }
    }, [props.modal]);


    const calculateOptimalRoute = (e) => {
        e.preventDefault();
        let waybillApps = apps.filter(app => app.status === 'exists' || app.status === 'added').map(app => {
            return app.id
        });
        let validationRes = checkIfRouteExists(waybillApps);
        let afterCheckRouteError = errors.validationErrors.filter(errors => errors !== "introduce-route");
        setErrors(prevState => ({
            ...prevState,
            validationErrors: [...afterCheckRouteError, ...validationRes]
        }));
        if (validationRes.length === 0) {
            setShowMap(true);
            fetch(`/customers/${customerId}/waybills/route?waybillAppsId=${waybillApps}`)
                .then(response => response.json())
                .then(commits => {
                    parseAndRenderRoute(commits.wayPoints);
                })
                .catch(error => setErrors({
                    serverErrors: "Something go wrong, try later",
                    validationErrors: []
                }));
        }
    };


    function parseAndRenderRoute(wayPoints) {
        let countPoints = wayPoints.length;
        let points = wayPoints.filter(wp => (wp.priority !== 0 && wp.priority !== (countPoints - 1)));
        let endPoint = wayPoints.filter(wp => wp.priority === (countPoints - 1));
        let startPoint = wayPoints.filter(wp => wp.priority === 0);
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
    }

    function getApps(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                commits.content.forEach(app => {
                    if (app.wayBillId) {
                        app.status = 'exists';
                    }
                });
                let existsApp = new Map(apps.map(app => [app.id, app]));
                let newApps = commits.content.filter(app => !existsApp.get(app.id));
                let replacedApps = commits.content.map(app => existsApp.get(app.id) || app);
                setRenderApps(replacedApps);
                setApps([...apps, ...newApps]);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages,
                    currentPage: (commits.pageable.pageNumber + 1)
                });
                setErrors({
                    serverErrors: '',
                    validationErrors: []
                });
            })
            .catch(error => setErrors({
                serverErrors: "Something go wrong, try later",
                validationErrors: []
            }));
    }

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


    const map =
        <MyMapComponent
            mapCenter={mapCenter}
            directions={directions}
            isMarkerShown
            loadingElement={<div style={{height: `100%`}}/>}
            containerElement={<div style={{height: `350px`}}/>}
            mapElement={<div style={{height: `100%`}}/>}
        />;

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

    const addAppToWaybill = (e) => {
        e.preventDefault();
        setDirections([]);
        setShowMap(false);
        setWaypoints([]);
        let res = errors.validationErrors.filter(e => e !== 'apps' && e !== 'route');
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
        let appId = e.currentTarget.id;
        let currentApp = {};
        let afterAdd = apps.map(app => {
            if (app.id == appId && app.status && app.status === 'deleted') {
                currentApp = app;
                app.status = 'exists';
            }

            if (app.id == appId && !app.status) {
                currentApp = app;
                app.status = 'added';
            }
            return app;
        });
        let totalAmount = totalValues.totalAmount + currentApp.items.reduce((t, i) => t + i.amount, 0);
        let totalUnits = totalValues.totalUnits + currentApp.items.reduce((t, i) => t + (i.amount * i.itemDto.units), 0);
        setTotalValues(prevState => ({
            ...prevState,
            totalUnits: totalUnits,
            totalAmount: totalAmount
        }));

        setApps(afterAdd);
    };

    const removeAppFromWaybill = (e) => {
        e.preventDefault();
        setDirections([]);
        setShowMap(false);
        setWaypoints([]);
        let appId = parseInt(e.currentTarget.id);
        let currentApp = {};
        let afterDelete = apps.map(app => {
            if (app.id == appId && app.status && app.status === 'exists') {
                app.status = 'deleted';
                currentApp = app;
            }

            if (app.id == appId && app.status && app.status === 'added') {
                delete app.status;
                currentApp = app;
            }
            return app;
        });
        let totalAmount = totalValues.totalAmount - currentApp.items.reduce((t, i) => t + i.amount, 0);
        let totalUnits = totalValues.totalUnits - currentApp.items.reduce((t, i) => t + (i.amount * i.itemDto.units), 0);
        setTotalValues(prevState => ({
            ...prevState,
            totalUnits: totalUnits,
            totalAmount: totalAmount
        }));
        setApps(afterDelete);

    };

    const hideModalHandler = () => {
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
        setWaybill();
        setRenderApps([]);
        setApps([]);
        setTotalValues({
            carCapacity: 0,
            totalAmount: 0,
            totalUnits: 0
        });
        setDirections([]);
        setShowMap(false);
        setWaypoints([]);
        setAppsLoading(true);
        props.onChange(false);
    };


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };


    function reRenderRoute(reordered) {
        let reorderdWaypoints = reordered.slice();
        let start = {lat: startPoint.address.latitude, lng: startPoint.address.longitude};
        let endWaypoint = reorderdWaypoints.pop();
        let end = {lat: endWaypoint.address.latitude, lng: endWaypoint.address.longitude};

        let waypointsToRender = reorderdWaypoints.map(wp => {
            return {
                location: {
                    lat: wp.address.latitude,
                    lng: wp.address.longitude
                },
                stopover: true
            }
        });

        renderRoute(start, end, waypointsToRender)
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const reordered = reorder(
            waypoints,
            result.source.index,
            result.destination.index
        );

        setWaypoints(reordered);
        reRenderRoute(reordered);
    }

    function buildWaybillDto() {
        waypoints.forEach((waypoint, i) => waypoint.priority = i + 1);
        let applications = JSON.parse(JSON.stringify(apps));
        let waybillDto = Object.assign(waybill);

        let appsDto = applications.filter(app => app.status === 'exists' || app.status === 'deleted' || app.status === 'added')
            .map(app => {
                app.status === 'deleted' ? app.deleteFromWaybill = delete app.status : delete app.status;
                return app;
            });
        waybillDto.applications = appsDto;
        waybillDto.route.wayPoints = [...waypoints, startPoint];
        delete waybillDto.registrationDate;
        delete waybillDto.lastUpdated;
        return waybillDto;
    }

    const updateWaybillHandler = (e) => {
        e.preventDefault();
        let waybillDto = buildWaybillDto();
        let validationResult = validateUpdatedWaybill(waybillDto);
        let carCapacityValid = checkCarCapacity(totalValues.carCapacity, totalValues.totalUnits);
        let checkRouteCalculated = checkIfRouteCalculated(waypoints);
        if (validationResult.length === 0 && carCapacityValid.length === 0 && checkRouteCalculated.length === 0) {

            fetch(`/customers/${customerId}/waybills/${waybillDto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(waybillDto)
            })
                .then(function (response) {
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
                        hideModalHandler();
                    }
                });
        } else {
            setErrors(prevState => ({
                ...prevState,
                validationErrors: [...validationResult, ...carCapacityValid, ...checkRouteCalculated]
            }))
        }
    };


    const addButton = <Button type="submit"
                              className="mainButton pull-right waybill-button"
                              onClick={updateWaybillHandler}>Save</Button>;

    const calculateRouteButton = <Button type="submit" className="mainButton pull-right waybill-button"
                                         onClick={calculateOptimalRoute}>Introduce route</Button>;


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
                                      value={waybill && waybill.sourceLocationWarehouseDto.identifier}
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
                <Col sm={6} style={{float: 'right'}}>
                    <Card className="total-card waybill-card-position" style={{marginLeft: '15px'}}>
                        <Card.Body>
                            <h6>Total amount of items</h6>
                            <Card.Text>
                                <h3>{totalValues.totalAmount}</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="total-card waybill-card-position" style={{marginLeft: '15px'}}>
                        <Card.Body>
                            <h6>Total number of units</h6>
                            <Card.Text>
                                <h3>{totalValues.totalUnits}</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="total-card waybill-card-position" style={{marginLeft: '15px'}}>
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
        </React.Fragment>;

    const appRows =
        <React.Fragment>
            {renderApps && renderApps.map(app => (
                <tr key={app.id}
                    className={app.status && (app.status === 'added' || app.status === 'exists') ? 'waybill-app' : ''}>
                    <td>
                        {(app.status === 'exists' || app.status === 'added') &&
                        <FaMinus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}
                                 size={'1.0em'}
                                 onClick={removeAppFromWaybill}
                        />}
                        {(app.status === 'deleted' || !app.status) &&

                        <FaPlus id={app.id} style={{textAlign: 'center', color: '#1A7FA8'}}
                                size={'1.0em'}
                                onClick={addAppToWaybill}
                        />
                        }
                    </td>
                    <td className="table-text-center">{app.number}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + i.amount, 0)}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + (i.amount * i.itemDto.units), 0)}</td>
                    <td style={{fontSize: '0.9rem', width: '37%'}}>
                        {app.destinationLocationDto.addressDto.city}{', '}
                        {app.destinationLocationDto.addressDto.addressLine1}{', '}
                        {app.destinationLocationDto.addressDto.addressLine2}</td>
                    <td className="table-text-center">{app.items.reduce((total, i) => total + i.cost, 0).toFixed(2)}</td>
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
            <div style={{fontSize: '0.8em'}}>
                <Pagination
                    activePage={page.currentPage}
                    itemsCountPerPage={page.countPerPage}
                    totalItemsCount={page.countPages * 5}
                    activeLinkClass="active-page-modal"
                    pageRangeDisplayed={3}
                    prevPageText="<"
                    nextPageText=">"
                    size="sm"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    innerClass="pagination justify-content-center"
                    onChange={(p) => {
                        let curr = p - 1;
                        getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto.id}&page=${curr}&size=5&waybillId=${props.modal.waybillId}`);
                    }}/></div>
        </React.Fragment>;

    const dragAndDropWaypoints =
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <ListGroup variant="flush">
                            <ListGroup.Item key={startPoint.address.addressLine1}>
                                <FaFlag
                                    style={{textAlign: 'center', color: 'green'}}
                                    size={'1.5em'}
                                />{startPoint.address.addressLine1}{','}{startPoint.address.addressLine2}
                            </ListGroup.Item>

                            {waypoints.map((m, index) =>
                                <Draggable key={m.address.addressLine1}
                                           draggableId={m.address.addressLine1} index={index}>
                                    {provided => (
                                        <ListGroup.Item key={m.address.addressLine1}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                        ><FaMapMarkerAlt style={{textAlign: 'center', color: '#1A7FA8'}}
                                                         size={'1.1em'}/>
                                            {m.address.addressLine1}{', '}{m.address.addressLine2}
                                        </ListGroup.Item>
                                    )}
                                </Draggable>)}
                        </ListGroup>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>;

    return (
        <>
            <Modal
                show={props.modal.isOpen}
                onHide={hideModalHandler}
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
                    {errors.validationErrors.includes("introduce-route") &&
                    <ErrorMessage message="Please, calculate route"/>}
                    {waybill && waybillContentData}
                    <div className="validation-error">
                        {errors.validationErrors.includes("apps") ? "Applications should be specified" : ""}
                    </div>
                    {errors.validationErrors.includes("route") &&
                    <ErrorMessage message="To calculate route choose applications"/>}
                    {appsLoading ?
                        <Row style={{height: '15%'}}><Spinner className="loading" variant="primary" animation="border"/></Row> :
                        <Card border="primary" style={{width: '100%', marginTop: '5px'}}>
                            <Card.Header>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                </Card.Text>
                                {apps.length > 0 && body}
                            </Card.Body>
                        </Card>
                    }
                    <Row style={{marginTop: '15px'}}>
                        <Col sm={6}>
                            {showMap && map}
                        </Col>
                        <Col sm={6}>
                            {waypoints.length > 0 && startPoint.address && dragAndDropWaypoints}
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
