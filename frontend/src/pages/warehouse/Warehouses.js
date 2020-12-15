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
        active: 1,
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

    const [errors, setErrors] = useState({
        errorMessage: ''
    });

    const handleCheckedChange = (warehouseId) => {
        let checkboxUpdate = checkBoxes.slice();

        const index = checkboxUpdate.indexOf(warehouseId);
        if (index > -1) {
            checkboxUpdate.splice(index, 1);
        } else {
            checkboxUpdate = [...checkboxUpdate, warehouseId];
        }
        setCheckBox(checkboxUpdate);
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
                        active: (commits.pageable.pageNumber + 1),
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
        }).then(response => {
            if (response.status !== 204) {
                setErrors({
                    errorMessage: "Something went wrong. Warehouse can not be deleted. Probably, it's already used in application or this warehouse still contains items."
                })
            } else {
                setErrors({
                    errorMessage: ''
                });
                setCheckBox([]);
                getWarehouses(`/customers/${currentCustomerId}/warehouses?size=${page.countPerPage}`);

            }
        })
    }

    function showAddress(address) {
        return `${address.city}, ${address.addressLine1}, 
        ${address.addressLine2}, ${address.state.state}`
    }

    const tableRows = warehouses.map(warehouse => (
        <tr key={warehouse.id}>
            <td onClick={() => {
                if (warehouse.type === 'WAREHOUSE') {
                    document.location.href = `/customers/${currentCustomerId}/warehouses/${warehouse.id}/items`
                }
            }}
            className={warehouse.type === "WAREHOUSE" && 'App-pointer'}>
                {warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td>{showAddress(warehouse.addressDto)}</td>
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
                <input type="checkbox"
                       checked={checkBoxes.find(e => e === warehouse.id)}
                       onClick={() => handleCheckedChange(warehouse.id)}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
            <ModalEditWarehouse editWarehouse={editWarehouse} onChange={closeModalEdit}
                                currentCustomerId={currentCustomerId}/>
            <ModalAddWarehouse lgShow={lgShow} onChange={closeModalAdd}
                               currentCustomerId={currentCustomerId}
            />
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col xs={6}>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>
                    <Button
                        variant="link"
                        disabled={checkBoxes.length === 0}
                        className="deleteButton" size="sm"
                        onClick={() => deleteWarehouse()}>
                        Delete
                    </Button>
                </Col>
                <Col xs={6}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>
        </React.Fragment>;

    const body =
        <React.Fragment>
            {warehouses.length > 0 &&
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Identifier</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Total Capacity</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>}
            {warehouses.length > 0 &&
            <Page page={page} onChange={changePage}/>}
            {warehouses.length == 0 &&
            <span>Empty list of warehouses.</span>}
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );
}
