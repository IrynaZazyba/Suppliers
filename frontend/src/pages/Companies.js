import React, {useContext, useState} from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {AuthContext} from "../context/authContext";

export default () => {
    const {user, setUser} = useContext(AuthContext);
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({
            ...user, currentCustomerId: currentCustomerId
        });
        window.location.assign('/customers/'+currentCustomerId+'/profile');
    };

    const handleSelect = (e) => {
        const value = e.target.value;
        setSelected(value);
    };

    return (
        <div className="loginCard">

            <Card style={{width: '25rem'}}
                  className="shadow p-3 mb-5 bg-white rounded">
                <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                    Choose company
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Control type="email" value={user.username} disabled/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select" onChange={handleSelect}>
                                {user.customers.map(custom => (
                                    <option key={custom.id} value={custom.id}>{custom.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button size="md" block
                                type="submit"
                                onClick={handleSubmit}
                                className="mainButton">
                            Apply
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );

}
