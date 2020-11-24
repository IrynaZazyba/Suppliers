import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import CardContainer from "../../components/CardContainer";
import ErrorMessage from "../../messages/errorMessage";
import ModalEditWarehouse from "./ModalEditWarehouse";
import {errorMessage} from "jest-validate";
import {FaEdit} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TogglePage from "../../components/TogglePage";
import ModalAddWarehouse from "./ModalAddWarehouse";

export default (props) => {

    const [page, setPage] = useState({
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });

    const [warehouses, setWarehouses] = useState([]);
    const [filter, setFilter] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
    });

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWarehouses(`/customers/${props.currentCustomerId}/warehouses?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getWarehouses(`/customers/${props.currentCustomerId}/warehouses?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getWarehouses(`/customers/${props.currentCustomerId}/warehouses?size=${page.countPerPage}`);
    }, []);

    function getWarehouses(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setWarehouses(commits.content);
                console.log(commits.content)
                setPage({
                        countPerPage: commits.size,
                        countPages: commits.totalPages
                    }
                );
            });
    }

    const closeModalEdit = (e, warehouseDto) => {
        console.log(warehouseDto)
        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (warehouseDto) {
            getWarehouses(`/customers/${props.currentCustomerId}/warehouses?size=${page.countPerPage}`);
        }
    };

    const closeModalAdd = (e, warehouseDto) => {
        setLgShow(e);
        if (warehouseDto) {
            getWarehouses(`/customers/${props.currentCustomerId}/warehouses?size=${page.countPerPage}`);
        }
    };

    const tableRows = warehouses.map(warehouse => (
        <tr key={warehouse.id}>
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
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalEditWarehouse props={editWarehouse} onChange={closeModalEdit}
                                currentCustomerId={props.currentCustomerId}/>
            <ModalAddWarehouse props={lgShow} onChange={closeModalAdd}
                               currentCustomerId={props.currentCustomerId}
            />
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>
                </Col>
                <Col md={14}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>
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
            <Page page={page} onChange={changePage}/>
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );
}
