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
import ModalAddActDispatcher from "./WriteOffModalDispatcher";

export default () => {

    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);
    const {user, setUser} = useContext(AuthContext);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [lgShow, setLgShow] = useState(false);
    const [acts, setActs] = useState([]);
    const [errorMessage, setErrors] = useState('');

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getActsByRole(user.role, `size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getActsByRole(user.role, `page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getActsByRole(user.role, `size=${page.countPerPage}`);
    }, []);

    function getActsByRole(role, parameters) {
        switch (role) {
            case "ROLE_DRIVER":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act/driver?${parameters}`);
                break;
            case "ROLE_DISPATCHER":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act/warehouses?${parameters}`);
                break;
            case "ROLE_ADMIN":
            case "ROLE_SYSTEM_ADMIN":
            case "ROLE_DIRECTOR":
                getWriteOffActs(`/customers/${currentCustomerId}/write-off-act?${parameters}`);
                break;
            default:
                break;
        }

    }

    function getWriteOffActs(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                if (commits.content) {
                    setActs(commits.content);
                    setPage({
                        active: (commits.pageable.pageNumber + 1),
                        countPerPage: commits.size,
                        countPages: commits.totalPages
                    });
                }
            });
    }

    const closeModalDispatcher = (e, actDto) => {
        setLgShow(e);
        if (actDto) {
            getActsByRole(user.role);
        }
    };

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
            <ModalAddActDispatcher props={lgShow} onChange={closeModalDispatcher}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            {(user.role === "ROLE_SYSTEM_ADMIN" || user.role === "ROLE_ADMIN" || user.role === "ROLE_DIRECTOR") &&
            <Row>
                <Col xs={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                        setLgShow(true)
                    }}>
                        Write off warehouse items
                    </Button>
                </Col>
                <Col xs={9}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
            {user.role === "ROLE_DISPATCHER" &&
            <Row>
                <Col xs={3}>
                    <Button className="mainButton" size="sm" onClick={() => {
                        setLgShow(true)
                    }}>
                        Write off warehouse items
                    </Button>
                </Col>
                <Col xs={9}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
            {user.role === "ROLE_DRIVER" &&
            <Row>
                <Col xs={12}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>}
        </React.Fragment>;

    const body =
        <React.Fragment>
            {(acts.length > 0) &&
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
            </Table>}
            {(acts.length > 0) &&
            <Page page={page} onChange={changePage}/>}

            {acts.length == 0 &&
            <span>Empty list of write-off acts</span>}
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
