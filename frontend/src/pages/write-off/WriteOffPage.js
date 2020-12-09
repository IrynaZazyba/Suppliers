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
import {AuthContext} from "../../context/authContext";

export default () => {

    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);
    const {user, setUser} = useContext(AuthContext);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [acts, setActs] = useState([]);
    const [errorMessage, setErrors] = useState('');

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getWriteOffActs(`/customers/${currentCustomerId}/write-off-act?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getWriteOffActs(`/customers/${currentCustomerId}/write-off-act?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getWriteOffActs(`/customers/${currentCustomerId}/write-off-act?size=${page.countPerPage}`);
    }, []);

    function getActsByRole(user) {
        switch (user.role) {
            case "ROLE_DRIVER":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act/driver?size=${page.countPerPage}`);
                break;
            case "ROLE_DISPATCHER":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act/dispatcher/?size=${page.countPerPage}`);
                break;
            case "ROLE_ADMIN" || "ROLE_SYSTEM_ADMIN" || "ROLE_DIRECTOR":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act?size=${page.countPerPage}`);
                break;

        }
    }

    function getWriteOffActs(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setActs(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const tableRows = acts.map(act => (
        <tr key={act.id}>
            <td onClick={() => document.location.href = `/customers/${currentCustomerId}/write-off-act/items/${act.id}`}>
                {act.identifier}</td>
            <td>{act.totalSum}</td>
            <td>{act.totalAmount}</td>
            <td>{act.date}</td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
        </React.Fragment>;

    const header =
        <React.Fragment>
            {(user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN") &&
            <Row>
                <Col md={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                    }}>
                        Write off warehouse items
                    </Button>
                </Col>
                <Col md={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                    }}>
                        Write off car items
                    </Button>
                </Col>
                <Col md={5}/>
                <Col md={1}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
            {user.role === "ROLE_DISPATCHER" &&
            <Row>
                <Col md={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                    }}>
                        Write off warehouse items
                    </Button>
                </Col>
                <Col md={8}/>
                <Col md={1}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
            {user.role === "ROLE_DRIVER" &&
            <Row>
                <Col md={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                    }}>
                        Write off car items
                    </Button>
                </Col>
                <Col md={8}/>
                <Col md={1}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
        </React.Fragment>;

    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>Identifier</th>
                    <th>Total sum</th>
                    <th>Total amount</th>
                    <th>Date</th>
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
