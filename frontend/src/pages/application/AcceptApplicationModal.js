import React, {useContext, useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import {AuthContext} from "../../context/authContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {FaCheck, FaMapMarkerAlt, FaTimes} from "react-icons/fa";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";

function AcceptApplicationModal(props) {

    const [app, setApp] = useState();
    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });
    const [availableCapacity, setAvailableCapacity] = useState();
    const [whCapacityPercentage, setWhPercentage] = useState();
    const [acceptedItems, setAcceptedItems] = useState([]);
    const [mapAppItems, setMapAppItems] = useState([]);
    const [serverError, setError] = useState('');

    useEffect(() => {
        if (props.props.isOpen === true) {
            fetch(`/customers/${customerId}/application/${props.props.appId}`)
                .then(response => response.json())
                .then(res => {
                    calculateTotalValues(res.items);
                    setApp(res);
                    let mappedItems = res.items.filter(i => i.acceptedAt == null).map(i => [i.id, i]);
                    setMapAppItems(new Map(mappedItems));
                    fetch(`/customers/${customerId}/warehouses/${res.destinationLocationDto.id}/capacity`)
                        .then(response => response.json())
                        .then(capacity => {
                            let percentage = (capacity * 100 / res.destinationLocationDto.totalCapacity).toFixed(2);
                            setWhPercentage(percentage);
                            setAvailableCapacity(capacity);
                        });
                });
        }
    }, [props.props.isOpen]);

    useEffect(() => {
        if (props.props.isOpen) {
            let percentage = (availableCapacity * 100 / app.destinationLocationDto.totalCapacity).toFixed(2);
            setWhPercentage(percentage);
        }
    }, [availableCapacity]);


    function calculateTotalValues(items) {
        setTotalValues(preState => ({
                ...preState,
                totalAmount: items.reduce((totalAmount, i) => totalAmount + parseInt(i.amount), 0),
                totalUnits: items.reduce((totalUnits, i) => totalUnits + parseFloat(i.itemDto.units) * parseInt(i.amount), 0)
            })
        );
    }

    const acceptItem = (e) => {
        const value = parseInt(e.currentTarget.id);
        let item = mapAppItems.get(value);
        let availableCapacityAfterChange = availableCapacity + (item.amount * item.itemDto.units);
        if (checkWhTotalCapacity(availableCapacityAfterChange)) {
            setAcceptedItems([...acceptedItems, value]);
            setAvailableCapacity(availableCapacityAfterChange);
        } else {

        }
    };

    const cancelAccept = (e) => {
        const value = parseInt(e.currentTarget.id);
        let removed = acceptedItems.filter(i => i !== value);
        setAcceptedItems(removed);
        let item = mapAppItems.get(value);
        let availableCapacityAfterChange = availableCapacity - (item.amount * item.itemDto.units);
        setAvailableCapacity(availableCapacityAfterChange);
    };

    function checkWhTotalCapacity(availableCapacity) {
        return app.destinationLocationDto.totalCapacity > availableCapacity;
    }

    const acceptAll = () => {
        let totalCapacityAcceptedItems = calculateTotalItemsCapacity();
        let resCapacity = availableCapacity + totalCapacityAcceptedItems;
        if (checkWhTotalCapacity(resCapacity)) {
            setAvailableCapacity(resCapacity);
            let acceptedIds = Array.from(mapAppItems.keys());
            setAcceptedItems(acceptedIds);
        }
    };

    const cancelAll = () => {
        let totalCapacityCanceledItems = calculateTotalItemsCapacity();
        let resCapacity = availableCapacity - totalCapacityCanceledItems;
        setAvailableCapacity(resCapacity);
        setAcceptedItems([]);
    };

    function calculateTotalItemsCapacity() {
        return app.items.filter(i => i.acceptedAt == null)
            .reduce((total, i) => total + i.amount * i.itemDto.units, 0);
    }

    const confirmAccept = (e) => {
        e.preventDefault();
        let appDto = Object.assign({}, app);
        appDto.items = acceptedItems.map(i => {
            return {id: i};
        });
        fetch(`/customers/${customerId}/warehouses/${appDto.destinationLocationDto.id}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appDto)
        })
            .then(function (response) {
                if (response.status !== 200) {
                    setError("Something go wrong, try later");
                } else {
                    setAcceptedItems([]);
                    setError('');
                    props.onChange(false, appDto);
                }
            });
    };

    const appData =
        <>
            {app &&
            <Row>
                <Col sm={8}>
                    <Row style={{margin: '10px 5px'}}>
                        <Col>
                            <span className="edit-appList">Number: </span> {app.number}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px'}}>
                        <Col><span className="edit-appList">Created by: </span>
                            {app.createdByUsersDto.username + ', ' + app.createdByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Registration date: </span>
                            {app.registrationDate}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px', paddingBottom: '15px'}}>
                        <Col><span className="edit-appList">Last updated by: </span>
                            {app.lastUpdatedByUsersDto.username + ', ' + app.lastUpdatedByUsersDto.surname}
                        </Col>
                        <Col style={{marginLeft: '-20px'}}>
                            <span className="edit-appList">Last updated date: </span>
                            {app.lastUpdated}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px', paddingBottom: '25px'}}>
                        <Col sm={5}
                             style={{borderLeft: '3px dotted yellowgreen'}}>
                            <span className="edit-appList">
                                <FaMapMarkerAlt style={{color: '#1A7FA8'}}/> Source location:<br/></span>
                            {app.sourceLocationDto.identifier} {', '}<br/>
                            {app.sourceLocationDto.addressDto.addressLine1} {', '}<br/>
                            {app.sourceLocationDto.addressDto.addressLine2}
                        </Col>
                        <Col sm={1}>

                        </Col>
                        <Col
                            style={{borderLeft: '3px dotted yellowgreen'}}
                            sm={5}><span className="edit-appList">
                            <FaMapMarkerAlt style={{color: '#1A7FA8'}}/> Destination location:<br/></span>
                            {app.destinationLocationDto.identifier} {', '}<br/>
                            {app.destinationLocationDto.addressDto.addressLine1} {', '}<br/>
                            {app.destinationLocationDto.addressDto.addressLine2}
                        </Col>
                    </Row>
                </Col>
                <Col sm={4}>
                    <Row>
                        <Col sm={6} style={{marginLeft: '-25px'}}>
                            <Card className="total-card">
                                <Card.Body>
                                    <h6>Total amount of items</h6>
                                    <Card.Text>
                                        <h3>{totalValues.totalAmount}</h3>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}>
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
                    <Row style={{marginTop: '25px'}}>
                        <h6>Available capacity{": "}</h6>
                        <span
                            style={{marginLeft: '10px'}}>{availableCapacity}</span>
                        <ProgressBar
                            variant={whCapacityPercentage > 70 ? "danger" : "success"}
                            className="wh-capacity-bar" now={whCapacityPercentage} label={`${whCapacityPercentage}%`}/>
                    </Row>
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
                    <th>Cost</th>
                    <th className="accept-all-item">
                        {acceptedItems.length === mapAppItems.size &&
                        <Button variant="link"
                                onClick={cancelAll}>cancel all</Button>}
                        {acceptedItems.length !== mapAppItems.size &&
                        <Button variant="link"
                                onClick={acceptAll}>accept all</Button>}
                    </th>
                </tr>
                </thead>
                <tbody>
                {app.items.map(i => (
                    <tr id={i.id} key={i.id}
                        className={(acceptedItems.includes(i.id) && "accepted-item") || (i.acceptedAt && "already-accepted")}>
                        <td>{i.itemDto.upc}</td>
                        <td>{i.itemDto.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.cost}</td>
                        <td style={{textAlign: 'center'}}>
                            {i.acceptedAt && i.acceptedAt}
                            {!i.acceptedAt && !acceptedItems.includes(i.id) &&
                            <FaCheck id={i.id} style={{color: '#1A7FA8'}}
                                     onClick={acceptItem}
                            />}
                            {!i.acceptedAt && acceptedItems.includes(i.id) &&
                            <FaTimes id={i.id} style={{color: '#1A7FA8'}}
                                     onClick={cancelAccept}
                            />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>}
        </React.Fragment>;

    return (
        <>
            <Modal
                show={props.props.isOpen}
                onHide={() => {
                    setAcceptedItems([]);
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title style={{width: '100%'}} id="modal-custom">
                        Accept application
                    </Modal.Title>
                    <div className="badge-edit-modal">
                        <h3><Badge className="badge-status status-in-modal">
                            {app && app.applicationStatus.replace('_', ' ').toLowerCase()}
                        </Badge>
                        </h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {appData}
                        <div className="validation-error">
                        </div>
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {itemsTable}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="float-right" style={{padding: '10px'}}>
                            <Button className="mainButton pull-right"
                                    onClick={confirmAccept}>
                                Confirm
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default AcceptApplicationModal;