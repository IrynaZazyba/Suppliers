import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Card from "react-bootstrap/Card";
import ErrorMessage from "../messages/errorMessage";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default () => {
    return (
        <div style={{
            margin: '70px 10px',
            height: '40px'
        }}>
            <Card style={{width: '25rem'}}
                  className="shadow p-3 mb-5 bg-white rounded">
                <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                    Log in
                </Card.Header>
                <Card.Body>

                </Card.Body>
            </Card>
        </div>
    )
}