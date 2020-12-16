import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";
import Row from "react-bootstrap/Row";
import CardContainer from "../../components/CardContainer";
import {FaEdit} from "react-icons/fa";
import ModalEditWarehouseRetailer from "./ModalEditWarehouseRetailer";
import ModalAddWarehouseRetailer from "./ModalAddWarehouseRetailer";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";

function ModalEditRetailer(props) {

    const ref = React.createRef();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [retailerDto, setRetailerDto] = useState({
        fullName: '',
        identifier: '',
        customerId: currentCustomerId,
        warehouses: []
    });
    const [warehouses, setWarehouses] = useState([]);
    const [warehouseDto, setWarehouseDto] = useState({
        id: '',
        customerId: currentCustomerId,
        identifier: '',
        type: '',
        deletedAt: '',
        addressDto: {
            state: {}
        },
        totalCapacity: ''
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [checkBoxes, setCheckBox] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
    });
    const [options, setOptions] = useState([]);

    const handleFullName = (e) => {
        setRetailerDto(preState => ({
            ...preState,
            fullName: e.target.value
        }));
    };
    const editWarehouseHandler = warehouse => {
        setWarehouses(preState =>
            preState.map(wh => wh.identifier === warehouse.identifier ? warehouse : wh)
        )
    }
    const handleId = (e) => {
        setRetailerDto(preState => ({
            ...preState,
            identifier: e.target.value
        }));
    };

    const handleCheckedChange = (warehouse) => {
        setCheckBox(preState => [...preState, warehouse])
    };

    function removeFromWarehouseArray() {
        setWarehouses(preState =>
            preState.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                checkBoxes
            )
        );
        fetch(`/customers/${currentCustomerId}/warehouses/delete-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkBoxes.map(e => e.id))
        })
            .then(response => {
                if (response.status !== 204) {
                    setErrors({
                        errorMessage: "Warehouse can not be deleted, because it is already used in application"
                    })
                } else {
                    setCheckBox([]);
                }
            });
    }

    useEffect(() => {
        if (props.props.editShow) {

            fetch(`/customers/${currentCustomerId}/retailers/${props.props.retailer.id}`)
                .then(response => response.json())
                .then(res => {
                    setRetailerDto(res);
                });
            fetch(`/customers/${currentCustomerId}/warehouses/retailers/${props.props.retailer.id}`)
                .then(response => response.json())
                .then(res => {
                    setWarehouses(res);
                });
        }
    }, [props.props.editShow]);

    const closeModalAdd = (e) => {
        setLgShow(e);

    };
    const closeModalEdit = (e) => {
        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));

    };
    const addWarehouseHandler = warehouse => {
        setWarehouses(preState => [...preState, warehouse]);
    };
    const editRetailerHandler = (e) => {
        e.preventDefault();
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
            .then(response => {
                if (response.status !== 201) {
                    setErrors({
                        serverErrors: "Something went wrong, try later",
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
    };
    const tableRows = warehouses.filter(warehouse => warehouse != null).map(warehouse => (
        <tr key={warehouse.identifier}>
            <td>{warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td>{warehouse.addressDto.city}, {warehouse.addressDto.addressLine1},
                {warehouse.addressDto.addressLine2}, {warehouse.addressDto.state.state}</td>
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
                show={props.props.editShow}
                onHide={() => {
                    setRetailerDto({});
                    setWarehouses([]);
                    props.onChange(false)
                }}
                aria-labelledby="modal-custom"
                className="shadow"

                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit retailer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Row>
                        <Form>
                            <Form.Group controlId="formBasicText" style={{padding: '0px 10px'}}>
                                <Form.Control type="text" placeholder="Name" value={retailerDto.fullName}
                                              onChange={handleFullName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid full name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                                <Form.Control type="text" placeholder="Identifier" value={retailerDto.identifier}
                                              onChange={handleId}
                                />
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
                                onClick={editRetailerHandler}>
                            Save
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditRetailer;
