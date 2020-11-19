import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {FaEdit} from "react-icons/fa";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import CardContainer from "../../components/CardContainer";

export default (props) => {

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });

    const [warehouses, setWarehouse] = useState([]);
    const [filter, setFilter] = useState([]);
    const [editCustomer, setEditCustomer] = useState({
        editShow: false,
        customer: []
    });

    const changePage = (e) => {
        e.preventDefault();
        let page = e.target.innerHTML - 1;
        getWarehouses(`/customers/${props.currentCustomerId}/warehouses/?page=${page}`);
    };

    useEffect(() => {
        getWarehouses('/customers/' + props.currentCustomerId + '/warehouses');
    }, []);

    function getWarehouses(url) {
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

    const tableRows = warehouses.map(warehouse => (
        <tr key={warehouse.id}>
            <td>{warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td>{warehouse.address}</td>
            <td>{warehouse.totalCapacity}</td>
            {/*<td><Form.Check*/}
            {/*    type="switch"*/}
            {/*    id={warehouse.id}*/}
            {/*    style={{width: '25px'}}*/}
            {/*    checked={warehouse.active}*/}
            {/*    value={warehouse.active}*/}
            {/*/>*/}
            {/*</td>*/}
        </tr>
    ));

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
            body={body}/>
    );
}
