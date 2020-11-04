import React, {useContext} from 'react';
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import {FaEdit} from "react-icons/fa";

export default () => {
    const {user, setUser} = useContext(AuthContext);


    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const handleSelect = (e) => {


    };

    return (
        <Container fluid className="mainContainer">
            <Button size="md"
                    type="button"
                    onClick={handleSubmit}
                    className="mainButton">
                Add
            </Button>
            <Button size="md"
                    type="button"
                    onClick={handleSubmit}
                    className="deleteButton">
                Remove
            </Button>
            <Table  bordered hover size="sm" style={{marginTop:'25px'}}>
                <thead>
                <tr>
                    <th style={{width: '2%'}}></th>
                    <th style={{width: '13%'}}>Name</th>
                    <th style={{width: '11%'}}>Registration date</th>
                    <th style={{width: '3%'}}>status</th>
                    <th style={{width: '15%'}}>email of admin</th>
                    <th style={{width: '2%'}}></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Form.Check type="checkbox"/></td>
                    <td>Mark</td>
                    <td>04.11.2020</td>
                    <td><Form.Check
                        type="switch"
                        id="custom-switch"
                   style={{width:'25px'}}/>
                    </td>
                    <td>admin@mdo</td>
                    <td><Button variant="link"><FaEdit style={{textAlign:'center', color: '#1A7FA8'}} size={'1.3em'}/></Button></td>
                </tr>
                <tr>
                    <td><Form.Check type="checkbox"/></td>
                    <td>Jacob</td>
                    <td>04.11.2020</td>
                    <td>@fat</td>
                    <td>admin@mdo</td>
                    <td><Button variant="link"><FaEdit style={{textAlign:'center',  color: '#1A7FA8'}} size={'1.3em'}/></Button></td>
                </tr>
                </tbody>
            </Table>
        </Container>);

}
