import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import {FaTrash} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form'
import ModalLg from "../../components/ModalLg";

function EditSupplyAppModal(props) {

    const customerId = props.props.customerId;
    const [app, setApp] = useState();
    const [currentItem, setCurrentItem] = useState([]);
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });


    useEffect(() => {
        if (props.props.isOpen === true) {
            console.log(props);
            console.log(props.props.app.id);

            fetch(`/customers/${customerId}/application/${props.props.app.id}`)
                .then(response => response.json())
                .then(res => {
                    console.log("******");
                    console.log(res);
                    setApp(res);
                });
        }
    }, [props.props.isOpen]);


    const deleteItem = (e) => {
        console.log(e.currentTarget.id);
        let afterDelete = [];
        app.items.forEach(i => {
            if (i.id != e.currentTarget.id) {
                afterDelete.push(i);
            }
        });
        setApp(prevState => ({
            ...prevState,
            items: afterDelete
        }));
    };

    // const handleSearch = (query) => {
    //     fetch(`/customers/${customerId}/item/upc?upc=${query}`)
    //         .then(resp => resp.json())
    //         .then(res => {
    //             const optionsFromBack = res.map((i) => ({
    //                 id: i.id,
    //                 upc: i.upc,
    //                 label: i.label,
    //                 units: i.units
    //             }));
    //             setOptions(optionsFromBack);
    //         });
    // };

    const appNumberOnChange = (e) => {
        const value = e.target.value;
        // checkValidationErrors("number");
        setApp(preState => ({
            ...preState,
            number: value
        }))
    };


    const itemsTable =
        <React.Fragment>
            {app && app.items.length > 0 &&
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Cost</th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {app.items.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.itemDto.upc}</td>
                        <td>{i.itemDto.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.cost}</td>
                        <td style={{textAlign: 'center'}}>
                            <FaTrash id={i.id} style={{color: '#1A7FA8'}}
                                     onClick={deleteItem}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>}
        </React.Fragment>;

    const appData =
        <>

            {app &&
            <Row>
                <Col sm={8}>
                    <Row style={{margin: '10px 5px'}}>
                        <Col>
                            <span
                                className="editAppList">Created by: </span>{app.createdByUsersDto.username + ', ' + app.createdByUsersDto.surname}
                        </Col>
                        <Col>
                            <span className="editAppList">Registration date: </span>{app.registrationDate}
                        </Col>
                    </Row>
                    <Row style={{margin: '10px 5px'}}>
                        <Col>
                            <span
                                className="editAppList">Last updated by: </span>{app.lastUpdatedByUsersDto.username + ', ' + app.lastUpdatedByUsersDto.surname}
                        </Col>
                        <Col>
                            <span className="editAppList">Last updated date: </span>{app.lastUpdated}
                        </Col>
                    </Row>

                    <Form.Group as={Row} controlId="appNumber">
                        <Form.Label column sm="3">Number</Form.Label>
                        <Col sm="7">
                            <Form.Control type="text" value={app.number} onChange={appNumberOnChange}
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
                        <Form.Label column sm="3">Source location</Form.Label>
                        <Col sm="7">
                            <Form.Control disabled type="text"
                                          value={app.sourceLocationDto.identifier + ', '
                                          + app.sourceLocationDto.addressDto.addressLine1 + ', '
                                          + app.sourceLocationDto.addressDto.state.state}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="destinationLocation">
                        <Form.Label column sm="3">Destination location</Form.Label>
                        <Col sm="7">
                            <Form.Control disabled type="text"
                                          value={app.destinationLocationDto.identifier + ', '
                                          + app.destinationLocationDto.addressDto.addressLine1 + ', '
                                          + app.destinationLocationDto.addressDto.state.state}/>
                        </Col>
                    </Form.Group>
                </Col>
                <Col sm={2} style={{marginLeft: '-25px'}}>
                    <Card className="total-card">
                        <Card.Body>
                            <h6>Total amount of items</h6>
                            <Card.Text>
                                <h3>10</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={2}>
                    <Card className="total-card">
                        <Card.Body>
                            <h6>Total number of units</h6>
                            <Card.Text>
                                <h3> 20</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            }
        </>;

    return (
        <>
            <ModalLg
                isOpen={props}
                title={"Edit supply application"}
                itemsTable={itemsTable}
                appDataFields={appData}
                status={app && app.applicationStatus.replace('_', ' ').toLowerCase()}
            />
        </>
    );

}

export default EditSupplyAppModal;
