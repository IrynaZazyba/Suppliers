import React, {useContext, useEffect, useState} from 'react';
import CardContainer from "../../components/CardContainer";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import {AuthContext} from "../../context/authContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TogglePage from "../../components/TogglePage";
import Badge from "react-bootstrap/Badge";
import {FaEdit} from "react-icons/fa";
import AddWaybillModal from "./AddWaybillModal";

export default () => {

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const {user, setUser} = useContext(AuthContext);
    const customerId = user.currentCustomerId;
    const [filter, setFilter] = useState([]);
    const filterOptions = {
        'All': '',
        'Ready': 'READY',
        'In progress': 'IN_PROGRESS',
        'Finished': 'FINISHED'
    };
    const [waybills, setWaybills] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getWaybill(`/customers/${customerId}/waybills?page=${currentPage}&size=${page.countPerPage}&status=${filter}`);
    };


    useEffect(() => {
        getWaybill(`/customers/${customerId}/waybills`);
    }, []);

    function getWaybill(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setWaybills(commits.content);
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
        getWaybill(`/customers/${customerId}/waybills?status=${e.target.value}&size=${page.countPerPage}`);
    };


    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWaybill(`/customers/${customerId}/waybills?size=${e.target.value}`);
    };

    const closeModalAdd = (e) => {
        setOpenAddModal(e);
        getWaybill(`/customers/${customerId}/waybills?size=${page.countPerPage}`);
    };


    function parseDestinationLocationsCities(waybill) {
        let map = waybill.applications.map(a =>
            a.destinationLocationDto.addressDto.city);
        return map.join(',\n');

    }

    const tableRows = waybills.map(waybill => (
        <tr key={waybill.id}>
            <td>{waybill.number}</td>
            <td style={{fontSize: '0.9rem'}}>{waybill.sourceLocationWarehouseDto.identifier}{','}<br/>
                {waybill.sourceLocationWarehouseDto.addressDto.city}{','}<br/>
                <span style={{fontSize: '0.8rem'}}>{waybill.sourceLocationWarehouseDto.addressDto.addressLine1}</span>
            </td>
            <td style={{fontSize: '0.8rem', width: '25%', padding: '5px'}}>
                {parseDestinationLocationsCities(waybill)}
            </td>
            <td className="table-text-center">{waybill.lastUpdated}</td>
            <td className="table-text-center">{waybill.updatedByUsersDto.surname}</td>
            <td className="table-text-center" style={{width: '45px'}}>
                <Badge className="badge-status">
                    {waybill.waybillStatus.replace('_', ' ').toLowerCase()}
                </Badge></td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        onClick={() => {

                        }}
                        size={'1.3em'}
            />
            </td>
        </tr>
    ));


    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Number</th>
                    <th>Source location</th>
                    <th>Destination locations, cities</th>
                    <th className="table-text-center">Last update date and time</th>
                    <th className="table-text-center">Updated by</th>
                    <th className="table-text-center">State</th>
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

    const modals =
        <React.Fragment>
            <AddWaybillModal modal={openAddModal} onChange={closeModalAdd}/>

        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => setOpenAddModal(true)}>
                        Create waybill
                    </Button>
                </Col>
                <Col md={7} className="checkbox-all-app">
                </Col>
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

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );
}
