import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/authContext";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import {FaEdit} from "react-icons/fa";
import Page from "../components/Page";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../components/TogglePage";
import RequestService from "../services/requestService";

export default () => {
    const {user, setUser} = useContext(AuthContext);
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [customers, setCustomers] = useState([]);
    const [switched, setSwitched] = useState(true);
    const requestService = new RequestService();

    const handleSubmit = (e) => {
        console.log(page);
        e.preventDefault();

    };

    const handleSwitch = (e) => {

        console.log(e.currentTarget);

        let status = e.target.value !== 'true';
        let id = e.eventPhase;
        fetch("/customers/" + id + "/status", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(status)
        })
            .then(function (response) {
                if (response.status !== 200) {
                    //todo
                } else {
                    let newData = [...customers];
                    newData.forEach(elem => {
                        if (elem.id === id) {
                            elem.active = status;
                        }
                    });
                    setCustomers(newData);
                }
            });
    };


    const changePage = (e) => {
        e.preventDefault();
        console.log(e.target.innerHTML);
        let page = e.target.innerHTML - 1;

        fetch('/customers?page=' + page)
            .then(response => response.json())
            .then(commits => {
                console.log(commits);
                // setPage({
                //     active: (commits.pageable.pageNumber + 1),
                //     countPerPage: "'" + commits.size + "'",
                //     countPages: commits.totalPages
                // });
                setCustomers(commits.content);

            });

    };

    useEffect(() => {
        fetch('/customers')
            .then(response => response.json())
            .then(commits => {
                setCustomers(commits.content);
                console.log(commits.pageable);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: "'" + commits.size + "'",
                    countPages: commits.totalPages
                });
            });
    }, []);


    return (
        <Container fluid className="mainContainer">
            <Card className="shadow-sm bg-white rounded">
                <Card.Header className="tableHead">
                    <Row>
                        <Col md={2}>
                            <Button className="mainButton" size="sm" onClick={handleSubmit}>
                                Add
                            </Button>
                        </Col>
                        <Col md={7}></Col>
                        <Col md={2}>
                            <Form.Control size="sm" as="select" defaultValue="Choose...">
                                <option>All</option>
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </Form.Control>
                        </Col>
                        <Col md={1}>
                            <TogglePage props={page}/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Table hover size="sm" style={{marginTop: '25px'}}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Registration date</th>
                            <th>Email of admin</th>
                            <th>status</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map(custom => (
                            <tr key={custom.id}>
                                <td>{custom.name}</td>
                                <td>{custom.registrationDate}</td>
                                <td>{custom.adminEmail}</td>
                                <td><Form.Check
                                    type="switch"
                                    id={custom.id}
                                    style={{width: '25px'}}
                                    onChange={handleSwitch}
                                    checked={custom.active}
                                    value={custom.active}
                                />
                                </td>
                                <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </Table>
                    <Page page={page} onChange={changePage}/>
                </Card.Body>
            </Card>
        </Container>
    );

}
