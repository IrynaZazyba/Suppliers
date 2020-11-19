import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import Page from "../../components/Page";
import CardContainer from "../../components/CardContainer";
import ErrorMessage from "../../messages/errorMessage";
import ModalEditWarehouse from "./ModalEditWarehouse";
import {errorMessage} from "jest-validate";
import {FaEdit} from "react-icons/fa";

export default (props) => {

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });

    const [warehouses, setWarehouse] = useState([]);
    const [editWarehouse, setEditWarehouse] = useState({
        editShow: false,
        warehouse: []
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

    const closeModalEdit = (e, warehouseDto) => {
        setEditWarehouse(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (warehouseDto) {
            getWarehouses(`/customers/${props.currentCustomerId}/warehouses/?size=${page.countPerPage}`);
        }
    };

    debugger;
    const tableRows = warehouses.map(warehouse => (
        <tr key={warehouse.id}>
            <td>{warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td/>
            {/*<td>{warehouse.address.city}</td>*/}
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
            <ModalEditWarehouse props={editWarehouse} onChange={closeModalEdit}/>
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
            body={body}/>
    );
}
