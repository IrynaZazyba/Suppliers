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
        'Open': 'OPEN',
        'Started processing': 'STARTED_PROCESSING',
        'Finished processing': 'FINISHED_PROCESSING'
    };
    const [errorMessage, setErrors] = useState('');
    const [modalAddSupplyOpen, setModalAddSupplyOpen] = useState(false);
    const [modalAddShipmentOpen, setModalAddShipmentOpen] = useState();
    const [modalAcceptOpen, setModalAcceptOpen] = useState();

    useEffect(() => {
        getApplications(`/customers/${customerId}/application`);
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

    const onChangeFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
        getApplications(`/customers/${customerId}/application?status=${e.target.value}&size=${page.countPerPage}`);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getApplications(`/customers/${customerId}/application?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApplications(`/customers/${customerId}/application?page=${currentPage}&size=${page.countPerPage}&status=${filter}`);
    };

    const closeAddSupplyModel = (isOpen, appDto) => {
        setModalAddSupplyOpen(isOpen);
        if (appDto) {
            getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}`);
        }
    };

    const closeModalAddShipment = (isOpen, appDto) => {
        setModalAddShipmentOpen(isOpen);
        if (appDto) {
            getApplications(`/customers/${customerId}/application?page=${page.currentPage}&size=${page.countPerPage}`);
        }
    };

    const closeModalAccept = (isOpen) => {
        setModalAcceptOpen(isOpen);
    };


    const tableRows = applications.map(app => (
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
            <td><Button variant="link"
                        onClick={() => setModalAcceptOpen(true)}>Accept</Button>
            </td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
            />
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <AddApplicationModal props={modalAddSupplyOpen} onChange={closeAddSupplyModel}/>
            <AddShipmentApplication props={modalAddShipmentOpen} onChange={closeModalAddShipment}/>
            <AcceptApplicationModal props={modalAcceptOpen} onChange={closeModalAccept}/>

        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={'auto'}>
                    <Button className="mainButton" size="sm" onClick={() => setModalAddSupplyOpen(true)}>
                        Add supply
                    </Button>
                </Col>
                <Col md={'auto'}>
                    <Button className="mainButton" size="sm" onClick={() => setModalAddShipmentOpen(true)}>
                        Add shipment
                    </Button>
                </Col>
                <Col md={6}></Col>
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
