/*global google*/
import React, {useContext, useEffect, useState} from "react";
import ErrorMessage from "../../messages/errorMessage";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import {ListGroup, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {DirectionsRenderer, GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import Table from "react-bootstrap/Table";
import {FaFlag, FaMapMarkerAlt, FaMinus, FaPlus} from "react-icons/fa";
import Page from "../../components/Page";
import Button from "react-bootstrap/Button";
import validateWaybill, {checkCarCapacity, checkIfRouteExists} from "../../validation/WaybillValidationRules";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";


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
    const [allLoadedApps, setAllLoadedApps] = useState([]);
    const [addedApps, setAddedApps] = useState([]);
    const [waybill, setWaybill] = useState({
        number: '',
        sourceLocationWarehouseDto: '',
        car: '',
        driver: '',
        applications: [],
    });
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 5,
        countPages: 1
    });
    const [directions, setDirections] = useState();
    const [waypoints, setWaypoints] = useState([]);
    const [startPoint, setStartPoint] = useState({});
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState({lat: 51.494900, lng: -0.146231});

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
            let waybillApps = allLoadedApps.filter(a => addedApps.includes(a.id));
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
                setAllLoadedApps(apps.concat(commits.content));
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
            sourceLocationWarehouseDto: sourceId
        }));
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApps(`/customers/${customerId}/application/warehouses?warehouseId=${waybill.sourceLocationWarehouseDto}&applicationStatus=OPEN&page=${currentPage}&size=5`);
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
        let carId = e.target.value;
        setWaybill(prevState => ({
            ...prevState,
            car: carId
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
        setAddedApps([...addedApps, parseInt(appId)]);
    };

    const saveWaybillHandler = (e) => {
        e.preventDefault();
        let validationResult = validateWaybill(waybill, addedApps, waypoints);
        let carCapacityValid = checkCarCapacity(totalValues.carCapacity, totalValues.totalUnits);
        //todo check directions exists
        if (validationResult.length === 0 && carCapacityValid.length === 0) {
            let waybillDto = buildWaybillDto();
            fetch(`/customers/${customerId}/waybills`, {
                method: 'POST',
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
                                validationErrors: ''
                            });
                        });
                    }
                    if (response.status !== 200 && response.status !== 400) {
                        setErrors({
                            serverErrors: "Something go wrong, try later",
                            validationErrors: ''
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
                validationErrors: [...validationResult, ...carCapacityValid]
            }))
        }
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
        setWaybill({});
        setAddedApps([]);
        setApps([]);
        setTotalValues({
            carCapacity: 0,
            totalAmount: 0,
            totalUnits: 0
        });
        setDirections([]);
        setShowMap(false);
        setWaypoints([]);
        setAllLoadedApps([]);
        props.onChange(false);
    };


    function buildWaybillDto() {
        waypoints.forEach((waypoint, i) => waypoint.priority = i + 1);
        let route = {wayPoints: [...waypoints, startPoint]};
        let applications = addedApps.map(app => {
            return {id: app}
        });
        return {
            route: route,
            car: {id: waybill.car},
            driver: {id: waybill.driver},
            sourceLocationWarehouseDto: {id: parseInt(waybill.sourceLocationWarehouseDto)},
            number: waybill.number,
            applications: applications
        };
    }

    function checkValidationErrors(fieldName) {
        let res = errors.validationErrors.filter(e => e != fieldName);
        setErrors(prevState => ({
            ...prevState,
            validationErrors: res
        }));
    }

    const removeAppFromWaybill = (e) => {
        e.preventDefault();
        setDirections([]);
        setShowMap(false);
        setWaypoints([]);
        let appId = parseInt(e.currentTarget.id);
        let result = addedApps.filter(app => app !== appId);
        setAddedApps(result);
    };

    const calculateOptimalRoute = (e) => {
        e.preventDefault();
        let validationRes = checkIfRouteExists(addedApps);
        let afterCheckRouteError = errors.validationErrors.filter(errors => errors !== "introduce-route");
        setErrors(prevState => ({
            ...prevState,
            validationErrors: [...afterCheckRouteError, ...validationRes]
        }));
        if (validationRes.length === 0) {
            setShowMap(true);
            fetch(`/customers/${customerId}/waybills/route?waybillAppsId=${addedApps}`)
                .then(response => response.json())
                .then(commits => {
                    let countPoints = commits.wayPoints.length;
                    let points = commits.wayPoints.filter(wp => (wp.priority !== 0 && wp.priority !== (countPoints - 1)));
                    let endPoint = commits.wayPoints.filter(wp => wp.priority === (countPoints - 1));
                    let startPoint = commits.wayPoints.filter(wp => wp.priority === 0);
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

    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={15}
            defaultCenter={mapCenter}>
            <Marker position={mapCenter}/>
            <DirectionsRenderer
                directions={directions}
            />
        </GoogleMap>
    ));


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

    const addButton = <Button type="submit"
                              className="mainButton pull-right waybill-button"
                              onClick={saveWaybillHandler}>Save</Button>;

    const calculateRouteButton = <Button type="submit" className="mainButton pull-right waybill-button"
                                         onClick={calculateOptimalRoute}>Introduce route</Button>;

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

    const map =
        <MyMapComponent
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAm-BUX0c9Pa7S5bylGeZAn05CGxjEJFv8&callback=initMap&libraries=geometry,drawing,places"
            loadingElement={<div style={{height: `100%`}}/>}
            containerElement={<div style={{height: `350px`}}/>}
            mapElement={<div style={{height: `100%`}}/>}
        />;

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
                show={props.modal}
                onHide={hideModalHandler}
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
                    {errors.validationErrors.includes("route") &&
                    <ErrorMessage message="To calculate route choose applications"/>}
                    {errors.validationErrors.includes("introduce-route") &&
                    <ErrorMessage message="Please, calculate route"/>}
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

export default AddWaybillModal;
