import {useContext, useEffect, useState} from "react";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";
import {useParams} from "react-router-dom";
import {FaTrash} from "react-icons/fa";
import ModalWriteOff from "../write-off/WriteOffModalWarehouse"


export default () => {

    const { warehouseId } = useParams();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [items, setItems] = useState([]);
    const [writeOffShow, setWriteOffShow] = useState({
        writeOffShow: false,
        warehouseId: warehouseId
    });
    const [errors, setErrors] = useState({
        errorMessage: ''
    });


    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWarehouseItems(`/customers/${currentCustomerId}/warehouses/items/${warehouseId}?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        setPage(preState => ({
            ...preState,
            currentPage: e.target.innerHTML - 1
        }));
        getWarehouseItems(`/customers/${currentCustomerId}/warehouses/items/${warehouseId}?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getWarehouseItems(`/customers/${currentCustomerId}/warehouses/items/${warehouseId}?size=${page.countPerPage}`);
    }, []);

    function getWarehouseItems(url) {
        setErrors('');
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setItems(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const tableRows = items.map(item => (
        <tr id={`whItem${item.id}`} key={item.id}>
            <td>{item.item.label}</td>
            <td>{item.item.upc}</td>
            <td>{item.item.units}</td>
            <td>{item.item.categoryDto.category}</td>
            <td>{item.amount}</td>
            <td><FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                         onClick={() => {
                         }}
            />
            </td>
        </tr>
    ));

    const closeModalAdd = (e, itemDto) => {
        setWriteOffShow(e);
        if (itemDto) {
            getWarehouseItems(`/customers/${currentCustomerId}/warehouses/items/${warehouseId}?size=${e.target.value}`);
        }
    };

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
            <ModalWriteOff props={writeOffShow} onChange={closeModalAdd}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => {}}>
                        Write-off items
                    </Button>
                </Col>
                <Col md={9}></Col>
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
                    <th>Label</th>
                    <th>UPC</th>
                    <th>Units per item</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
