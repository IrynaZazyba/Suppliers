import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import CardContainer from "../../components/CardContainer";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ModalEditWarehouseRetailer from "./ModalEditWarehouseRetailer";
import ModalAddWarehouseRetailer from "./ModalAddWarehouseRetailer";
import {FaEdit} from "react-icons/fa/index";
import "./styles.css"
import axios from "axios";

function ModalAddRetailer(props) {
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const [retailerDto, setRetailerDto] = useState({
        fullName: '',
        identifier: '',
        customerId: currentCustomerId,
        warehouses: ''
    });

    const [checkBoxes, setCheckBox] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
    });

    const addWarehouseHandler = warehouse => {
        warehouses.push(warehouse);
    }
    const editWarehouseHandler = warehouse => {
        setWarehouses(preState =>
            preState.map(wh => wh.identifier === warehouse.identifier ? warehouse : wh)
        )
    }
    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const handleFullName = (e) => {
        setRetailerDto(preState => ({
            ...preState,
            fullName: e.target.value
        }));
    };
    const handleId = (e) => {
        setRetailerDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    useEffect(() => {
        if (props.props.editShow) {
            fetch(`customers/${currentCustomerId}/retailers/${props.props.retailer.id}`)
                .then(response => response.json())
                .then(res => {
                    setRetailerDto(res);
                });
        }
    }, [props.props.editShow]);
    const addRetailerHandler = (e) => {

        setErrors(preState => ({
            ...preState,
            validationErrors: ''
        }));

                retailerDto.warehouses = warehouses;
        fetch(`/customers/${currentCustomerId}/retailers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(retailerDto)
        })
            .then(function (response) {
                if (response.status !== 201) {
                    setErrors({
                        serverErrors: "Something go wrong, try later",
                        validationErrors: ''
                    });
                } else {
                    setErrors(preState => ({
                        ...preState,
                        validationErrors: []
                    }));
                    setCheckBox([]);
                    props.onChange(false, retailerDto);
                }
            });

    };

    const handleCheckedChange = (warehouse) => {
        setCheckBox(preState => [...preState, warehouse])
    };


    const closeModalEdit = (e) => {
        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));

    };

    const closeModalAdd = (e) => {
        setLgShow(e);
    };

    function removeFromWarehouseArray() {
        setWarehouses(preState =>
            preState.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                checkBoxes
            )
        )
    }

    const tableRows = warehouses.filter(warehouse => warehouse != null).map(warehouse => (
        <tr key={warehouse.identifier}>
            <td>{warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td>{warehouse.addressDto.city}, {warehouse.addressDto.addressLine1},
                {warehouse.addressDto.addressLine2}, {warehouse.addressDto.state.state}</td>
            <td>{warehouse.totalCapacity}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1a7fa8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditWarehouse({
                                editShow: true,
                                warehouse: warehouse
                            });
                        }}/>
            </td>
            <td>
                <input type="checkbox" onClick={() => handleCheckedChange(warehouse)}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>

            <ModalEditWarehouseRetailer props={editWarehouse} onEditWarehouse={editWarehouseHandler}
                                        onChange={closeModalEdit}
                                        currentCustomerId={currentCustomerId}/>
            <ModalAddWarehouseRetailer props={lgShow} onAddWarehouse={addWarehouseHandler} onChange={closeModalAdd}
                                       currentCustomerId={currentCustomerId}
            />
        </React.Fragment>;

    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Identifier</th>
                    <th>Type</th>
                    <th>Full Address</th>
                    <th>Total Capacity</th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={"auto"}>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>

                </Col>
                <Col md={"auto"}>

                    <Button
                        variant="link"
                        disabled={checkBoxes.length === 0}
                        className="deleteButton" size="sm"
                        onClick={removeFromWarehouseArray}>
                        Delete
                    </Button>
                </Col>
                <Col md={11}/>
            </Row>
        </React.Fragment>;

    return (
        <>
            <Modal
                contentClassName="custom-modal-style"
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add retailer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Row>
                        <Form>
                            <Form.Group controlId="formBasicText" style={{padding: '0px 10px'}}>
                                <Form.Control type="text" placeholder="Name" onChange={handleFullName}
                                              className={
                                                  errors.validationErrors.includes("fullName")
                                                      ? "form-control is-invalid"
                                                      : "form-control"
                                              }/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid customer name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                                <Form.Control type="text" placeholder="Identifier" onChange={handleId}
                                              className={
                                                  errors.validationErrors.includes("identifier")
                                                      ? "form-control is-invalid"
                                                      : "form-control"
                                              }/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid identifier.
                                </Form.Control.Feedback>
                            </Form.Group>


                        </Form>
                    </Row>
                    <Row className={"warehouseContainer"}>
                        <CardContainer
                            style={{padding: '0px 0px 0px 0px'}}
                            modals={modals}
                            header={header}
                            body={body}/>
                    </Row>
                    <div className="float-right" style={{paddingRight: '0px'}}>
                        <Button type="submit" className="mainButton pull-right"
                                onClick={addRetailerHandler}>
                            Save
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

        </>

    );
}

export default ModalAddRetailer;
