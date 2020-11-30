import {useContext, useEffect, useState} from "react";
import Page from "../../components/Page";
import {FaEdit} from "react-icons/fa";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";
import {useParams} from "react-router-dom";


export default () => {

    const { warehouseId } = useParams();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [items, setItems] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [errors, setErrors] = useState({
        errorMessage: ''
    });

    useEffect(() => {
        getWarehouse(`/customers/${currentCustomerId}/warehouses/${warehouseId}`);
    }, []);

    function getWarehouse(url) {
        setErrors('');
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setWarehouse(commits);
            });
    }

    const tableRows =
        <tr id={`whItem${warehouse.id}`} key={warehouse.id}>
            <td>{warehouse.identifier}</td>
            <td>{warehouse.type}</td>
            <td>{warehouse.totalCapacity}</td>
        </tr>
    ;

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={12}></Col>
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
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
