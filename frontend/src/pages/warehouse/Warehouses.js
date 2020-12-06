import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import CardContainer from "../../components/CardContainer";
import ErrorMessage from "../../messages/errorMessage";
import ModalEditWarehouse from "./ModalEditWarehouse";
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
    const currentCustomerId = localStorage.getItem("currentCustomerId") != null
        ? localStorage.getItem("currentCustomerId") : 0;

    const [checkBoxes, setCheckBox] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
    });
    const [errorMessage, setErrors] = useState('');

    const handleCheckedChange = (warehouseId) => {
        const index = checkBoxes.indexOf(warehouseId);
        if (index > -1) {
            checkBoxes.splice(index, 1);
        } else {
            checkBoxes.push(warehouseId);
        }
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getWarehouses(`/customers/${currentCustomerId}/warehouses?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${page.countPerPage}`);
    }, []);

    function getWarehouses(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setWarehouses(commits.content);
                setPage({
                        countPerPage: commits.size,
                        countPages: commits.totalPages
                    }
                );
            });
    }

    const closeModalEdit = (e, warehouseDto) => {

        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (warehouseDto) {
            getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${page.countPerPage}`);
        }
    };

    const closeModalAdd = (e, warehouseDto) => {
        setLgShow(e);
        if (warehouseDto) {
            getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${page.countPerPage}`);
        }
    };

    function deleteWarehouse() {
        fetch(`/customers/${currentCustomerId}/warehouses/delete-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkBoxes)
        })
            .then(response => {
                if (response.status !== 204) {
                    setErrors({
                        errorMessage: "Warehouse can not be deleted, because it is already used in application"
                    })
                } else {
                    fetch(`/customers/${currentCustomerId}/users/delete-list`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(checkBoxes)
                    })
                    setCheckBox([]);
                    getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${page.countPerPage}`);
                }
            });
    }

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
            <td>
                <input type="checkbox" onClick={() => handleCheckedChange(warehouse.id)}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalEditWarehouse editWarehouse={editWarehouse} onChange={closeModalEdit}
                                currentCustomerId={currentCustomerId}/>
            <ModalAddWarehouse lgShow={lgShow} onChange={closeModalAdd}
                               currentCustomerId={currentCustomerId}
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
                <Col md={10}>
                    <Button className="mainButton" size="sm" onClick={() => deleteWarehouse()}>
                        Delete
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
