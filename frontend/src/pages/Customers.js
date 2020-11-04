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
    const [customers, setCustomers] = useState();
    const requestService = new RequestService();

    const handleSubmit = (e) => {
        e.preventDefault();

        let resource = requestService.getResource("/customers");
        console.log(resource);

    };

    const handleSelect = (e) => {

    };


    // useEffect(() => {
    //     let resource = requestService.getResource("/customers");
    //     console.log(resource);
    // }, []);


    return (
        <Container fluid className="mainContainer">
            <Card className="shadow-sm bg-white rounded">
                <Card.Header className="tableHead">
                    <Row>
                        <Col md={2}>
                            <Button className="mainButton" size="sm" onClick={handleSubmit}>
                                Add
                            </Button>
                            <Button className="deleteButton" size="sm">
                                Remove
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
                            <TogglePage/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Table hover size="sm" style={{marginTop: '25px'}}>
                        <thead>
                        <tr>
                            <th style={{width: '2%'}}></th>
                            <th style={{width: '11%'}}>Name</th>
                            <th style={{width: '11%'}}>Registration date</th>
                            <th style={{width: '11%'}}>email of admin</th>
                            <th style={{width: '5%'}}>status</th>
                            <th style={{width: '2%'}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check type="checkbox"/></td>
                            <td>Mark</td>
                            <td>04.11.2020</td>
                            <td>admin@mdo</td>
                            <td><Form.Check
                                type="switch"
                                id="custom-switch"
                                style={{width: '25px'}}/>
                            </td>
                            <td><a href='#'><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}} size={'1.3em'}/></a>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                    <Page/>
                </Card.Body>
            </Card>
        </Container>
    );

}
