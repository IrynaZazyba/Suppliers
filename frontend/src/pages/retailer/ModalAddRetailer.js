import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateCustomer from "../../validation/CustomerValidationRules";
import ErrorMessage from "../../messages/errorMessage";
import CardContainer from "../../components/CardContainer";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import ModalEditWarehouseRetailer from "./ModalEditWarehouseRetailer";
import ModalAddWarehouseRetailer from "./ModalAddWarehouseRetailer";
import {FaEdit} from "react-icons/fa/index";
import "./styles.css"
import * as JSONwarehouses from "react-bootstrap";
import {forEach} from "react-bootstrap/ElementChildren";
function ModalAddRetailer(props) {
    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.
    getItem("currentCustomerId"): 0;

    const [retailerDto, setRetailerDto] = useState({
        fullName: '',
        identifier: '',
        customerId: currentCustomerId,
        warehouses: []
    });

    const warehouse = localStorage.
    getItem("warehouse") != null ? localStorage.
    getItem("warehouse"): null;

    const [checkBoxes, setCheckBox] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
    });


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

    const addRetailerHandler = (e) => {
        e.preventDefault();
       // let validationResult = validateCustomer(retailerDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: ''
        }));
     //   if (validationResult.length === 0) {
        console.log(warehouse);
        warehouses.push(warehouse);
       // setWarehouses(warehouses);
        console.log(warehouses);
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
                        props.onChange(false, retailerDto);
                    }
                });
    //    }
    };

    const handleCheckedChange = (warehouseId) => {
            checkBoxes.push(warehouseId);
    };



    useEffect(() => {

        console.log(warehouse);
        warehouses.push(JSON.parse(warehouse));
        localStorage.removeItem("warehouse");
        console.log(warehouses);
        if (warehouse != null && warehouses.length!=0){

      }


        }, []);

    function getWarehouses(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
            //    setWarehouses(commits.content);
                console.log(commits.content)
            });
    }

    const closeModalEdit = (e, warehouseDto) => {
        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (warehouseDto) {
            getWarehouses(`/customers/${currentCustomerId}/warehouses/type?type=RETAILER`);
        }
    };

    const closeModalAdd = (e, warehouseDto) => {
        setLgShow(e);
        if (warehouseDto) {
            getWarehouses(`/customers/${currentCustomerId}/warehouses/type?type=RETAILER`);
        }
    };

    function deleteWarehouse() {
        console.log( JSON.stringify(checkBoxes));
        const filtered = warehouses.filter(
            function (e) {
                return this.indexOf(e) < 0;
            },
            checkBoxes
        );
        console.log(filtered);
        // fetch(`/customers/${currentCustomerId}/warehouses/delete-list`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(checkBoxes)
        // })
        //     .then(response => {
        //         if (response.status !== 204) {
        //             setErrors({
        //                 errorMessage: "Warehouse can not be deleted, because it is already used in application"
        //             })
        //         } else {
        //             setCheckBox([]);
        //             getWarehouses(`/customers/${currentCustomerId}/warehouses/type?type=RETAILER`);
        //         }
        //     });
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

            <ModalEditWarehouseRetailer props={editWarehouse} onChange={closeModalEdit}
                                        currentCustomerId={currentCustomerId}/>
            <ModalAddWarehouseRetailer props={lgShow} onChange={closeModalAdd}
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
                <Col>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>
                </Col>
                <Col md={10}>
                    <Button className="mainButton" size="sm" onClick={() => deleteWarehouse()}>
                        Delete
                    </Button>
                </Col>

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
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
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
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addRetailerHandler}>
                                Save
                            </Button>
                        </div>

                    </Form>
                    <CardContainer
                        style={{padding: '0px 0px 0px 0px'}}
                        modals={modals}
                        header={header}
                        body={body}/>
                </Modal.Body>
            </Modal>

        </>

    );
}

export default ModalAddRetailer;
