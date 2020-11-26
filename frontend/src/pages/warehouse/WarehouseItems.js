import {useContext, useEffect, useState} from "react";
import Page from "../../components/Page";
import {FaEdit} from "react-icons/fa";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import ModalAddItem from "../item/ModalAddItem";
import ModalEditItem from "../item/ModalEditItem";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";
import {FaTrash} from "react-icons/fa";

export default (props) => {

    const warehouseId = props.match?.params.warehouseId;
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [items, setItems] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [errors, setErrors] = useState({
        errorMessage: ''
    });

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWarehouse(`/customers/${currentCustomerId}/warehouse/${warehouseId}?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        setPage(preState => ({
            ...preState,
            currentPage: e.target.innerHTML - 1
        }));
        getWarehouse(`/customers/${currentCustomerId}/warehouse/${warehouseId}?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getWarehouse(`/customers/${currentCustomerId}/warehouse/${warehouseId}?size=${page.countPerPage}`);
    }, []);

    function getWarehouse(url) {
        setErrors('');
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setWarehouse(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const tableRows = warehouse.items.map(whItem => (
        <tr id={`whItem${whItem.id}`} key={whItem.id}>
            <td>{whItem.itemDto.label}</td>
            <td>{whItem.itemDto.units}</td>
            <td>{whItem.amount}</td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={11}></Col>
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
                    <th>Units per item</th>
                    <th>Amount</th>
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
