import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const CardContainer = props => {

    const {
        modals,
        header,
        body,
    } = props;

    return (
        <Container fluid className="mainContainer">
            {modals()}
            <Card className="shadow-sm bg-white rounded">
                <Card.Header className="tableHead">
                    {header()}
                </Card.Header>
                <Card.Body>
                    {body()}
                </Card.Body>
            </Card>
        </Container>
    );

};

export default CardContainer;
