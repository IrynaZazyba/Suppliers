import React, {useContext, useEffect, useState} from 'react';
import CardContainer from "../../components/CardContainer";
import Table from "react-bootstrap/Table";
import {FaEdit} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TogglePage from "../../components/TogglePage";
import Page from "../../components/Page";
import Form from 'react-bootstrap/Form'
import ErrorMessage from "../../messages/errorMessage";
import AddApplicationModal from "./AddApplicationModal";
import {AuthContext} from "../../context/authContext";
import Badge from "react-bootstrap/Badge";
import AddShipmentApplication from "./AddShipmentApplication";
import AcceptApplicationModal from "./AcceptApplicationModal";
import EditSupplyAppModal from "./EditSupplyAppModal";
import EditShipmentModal from "./EditShipmentModal";

export default () => {

    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;

    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [filter, setFilter] = useState([]);
    const filterOptions = {
        'All': '',
        'Open': 'OPEN',
        'Started processing': 'STARTED_PROCESSING',
        'Finished processing': 'FINISHED_PROCESSING'
    };
    const [errorMessage, setErrors] = useState('');
    const [modalAddSupplyOpen, setModalAddSupplyOpen] = useState(false);
    const [modalAddShipmentOpen, setModalAddShipmentOpen] = useState();
    const [modalAcceptOpen, setModalAcceptOpen] = useState({
        isOpen: false,
        appId: '',
        customerId: customerId
    });
    const [openEditModal, setOpenEditModal] = useState({
        isOpen: false,
        app: [],
        customerId: customerId
    });
    const [openEditShipmentModal, setOpenEditShipmentModal] = useState({
        isOpen: false,
        app: [],
        customerId: customerId
    });
    const [isAll, setBelongToWarehouse] = useState(false);
    const [isCheckboxAll, setCheckbox] = useState({
        checkboxChecked: false
    });


    useEffect(() => {
        getApplications(`/customers/${customerId}/application?isAll=${isAll}`);
    }, []);

    function getApplications(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setApplications(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const handleBelongToDispatcherFilter = (e) => {
        let value = e.target.checked;
        setCheckbox(value);
        setBelongToWarehouse(value);
        getApplications(`/customers/${customerId}/application?size=${page.countPerPage}&isAll=${value}`);
    };

    const onChangeFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
        getApplications(`/customers/${customerId}/application?status=${e.target.value}&size=${page.countPerPage}&isAll=${isAll}`);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getApplications(`/customers/${customerId}/application?size=${e.target.value}&isAll=${isAll}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApplications(`/customers/${customerId}/application?page=${currentPage}&size=${page.countPerPage}&status=${filter}&isAll=${isAll}`);
    };

    const closeAddSupplyModel = (isOpen, appDto) => {
        setModalAddSupplyOpen(isOpen);
        if (appDto) {
            getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}&isAll=${isAll}`);
        }
    };

    const closeModalAddShipment = (isOpen, appDto) => {
        setModalAddShipmentOpen(isOpen);
        if (appDto) {
            getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}&isAll=${isAll}&status=${filter}`);
        }
    };

    const closeModalEdit = (e) => {
        setOpenEditModal(e);
        getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}&isAll=${isAll}&status=${filter}`);

    };

    const closeModalEditShipment = (e) => {
        setOpenEditShipmentModal(e);
        getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}&isAll=${isAll}&status=${filter}`);
    };

    const closeModalAccept = (isOpen) => {
        setModalAcceptOpen(isOpen);
        getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}&isAll=${isAll}&status=${filter}`);
    };


    const tableRows = applications && applications.map(app => (
        <tr key={app.id}>
            <td>{app.number}</td>
            <td style={{fontSize: '0.9rem'}}>{app.sourceLocationDto.identifier}{','}<br/>
                {app.sourceLocationDto.addressDto.city}{','}<br/>
                {app.sourceLocationDto.addressDto.addressLine1}
            </td>
            <td style={{fontSize: '0.9rem'}}>{app.destinationLocationDto.identifier}{','}<br/>
                {app.destinationLocationDto.addressDto.city}{','}<br/>
                {app.destinationLocationDto.addressDto.addressLine1}
            </td>
            <td>{app.lastUpdated}</td>
            <td className="table-text-center">{app.lastUpdatedByUsersDto.surname}</td>
            <td className="table-text-center" style={{width: '45px'}}>
                <Badge className="badge-status">
                    {app.applicationStatus.replace('_', ' ').toLowerCase()}
                </Badge></td>
            <td>
                {app.type === 'SUPPLY' &&
                <Button variant="link"
                        disabled={app.applicationStatus === 'FINISHED_PROCESSING'}
                        onClick={() => {
                            setModalAcceptOpen({
                                isOpen: true,
                                appId: app.id,
                                customerId: customerId
                            });
                        }}>Accept</Button>}
            </td>
            <td>
                {user.role === 'ROLE_DISPATCHER' &&
                <FaEdit className={app.applicationStatus === 'FINISHED_PROCESSING' || app.wayBillId
                    ? "edit-app-icon-disable"
                    : "edit-app-icon-active"}
                        size={'1.3em'}
                        onClick={() => {

                            let statusRule = app.applicationStatus === 'OPEN'
                                || app.applicationStatus === 'STARTED_PROCESSING';

                            if (app.type === 'SUPPLY' && statusRule && !app.wayBillId) {
                                setOpenEditModal({
                                    isOpen: true,
                                    app: app,
                                    customerId: customerId
                                });
                            } else if (app.type === 'TRAFFIC' && statusRule && !app.wayBillId) {
                                setOpenEditShipmentModal({
                                    isOpen: true,
                                    app: app,
                                    customerId: customerId
                                });
                            }
                        }}
                />}
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <AddApplicationModal props={modalAddSupplyOpen} onChange={closeAddSupplyModel}/>
            <AddShipmentApplication props={modalAddShipmentOpen} onChange={closeModalAddShipment}/>
            <EditSupplyAppModal props={openEditModal} onChange={closeModalEdit}/>
            <EditShipmentModal props={openEditShipmentModal} onChange={closeModalEditShipment}/>
            <AcceptApplicationModal modal={modalAcceptOpen} onChange={closeModalAccept}/>

        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                {user.role === 'ROLE_DISPATCHER' ? <>
                    <Col md={'auto'}>
                        <Button className="mainButton" size="sm" onClick={() => setModalAddSupplyOpen(true)}>
                            Add supply
                        </Button>
                    </Col>
                    <Col md={'auto'}>
                        <Button className="mainButton" size="sm" onClick={() => setModalAddShipmentOpen(true)}>
                            Add shipment
                        </Button>
                    </Col></> : <Col md={3}></Col>}
                <Col md={4}></Col>
                {user.role === 'ROLE_DISPATCHER'? <><Col md={2} className="checkbox-all-app">
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="See all"
                            onChange={handleBelongToDispatcherFilter}
                            checked={isCheckboxAll.checkboxChecked}/>
                    </Form.Group>
                </Col></>: <Col md={2}></Col>}
                <Col md={2}>
                    <Form.Control size="sm" as="select"
                                  value={filter}
                                  defaultValue="Choose..."
                                  onChange={onChangeFilter}>
                        {Object.entries(filterOptions).map(([k, v]) => (
                            <option value={v}>{k}</option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md={1}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>
        </React.Fragment>;

    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Number</th>
                    <th>Source location</th>
                    <th>Destination location</th>
                    <th>Last update date</th>
                    <th className="table-text-center">Updated by</th>
                    <th className="table-text-center">Status</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>
            <Page page={page} onChange={changePage}/>
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
