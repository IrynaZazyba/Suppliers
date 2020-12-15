import {useEffect, useState} from "react";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";
import {useParams} from "react-router-dom";
import ModalWriteOff from "../write-off/WriteOffModalWarehouse"
import Page from "../../components/Page";


export default () => {

    const {warehouseId} = useParams();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [items, setItems] = useState([]);
    const [writeOffModal, setWriteOffShow] = useState({
        writeOffShow: false,
        warehouseId: ''
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
        </tr>
    ));

    const closeModalAddAct = (e, warehouseDto) => {
        setWriteOffShow(e);
        if (warehouseDto) {
            getWarehouseItems(`/customers/${currentCustomerId}/warehouses/items/${warehouseId}?size=${page.countPerPage}`);
        }
    };

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
            <ModalWriteOff props={writeOffModal} onChange={closeModalAddAct}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => {
                        setWriteOffShow({
                            writeOffShow: true,
                            warehouseId: warehouseId
                        })
                    }}>
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
            {items.length > 0 &&
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Label</th>
                    <th>UPC</th>
                    <th>Units per item</th>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>}
            {(items.length > 0) &&
            <Page page={page} onChange={changePage}/>}
            {items.length == 0 &&
            <span>Empty list of items.</span>}
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
