import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import ErrorMessage from "../../messages/errorMessage";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Card from "react-bootstrap/Card";

function ModalAddApplication(props) {

    const [appDto, setApp] = useState({});

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [options, setOptions] = useState([]);
    const [item, setItems] = useState([]);

    const handleSearch = () => {
        fetch(`/`)
            .then((resp) => resp.json())
            .then(({items}) => {
                const options = items.map((i) => ({
                    id: i.id,
                    name: i.upc,
                }));

                setOptions(options);
            });
    };


    return (
        <>
            <Modal
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create supply application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group as={Row} controlId="appNumber">
                            <Form.Label column sm="2">Number</Form.Label>
                            <Col sm="5">
                                <Form.Control type="text"/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid number.
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="sourceLocation">
                            <Form.Label column sm="2">Source location</Form.Label>
                            <Col sm="5">
                                <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="destinationLocation">
                            <Form.Label column sm="2">Destination location</Form.Label>
                            <Col sm="5">
                                <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        {/*<Row style={{padding: '0px 10px'}}>*/}
                        {/*    <Col>*/}
                        {/*        <h6>Items</h6>*/}
                        {/*    </Col>*/}
                        {/*    <Col style={{textAlign: 'end'}}>*/}
                        {/*        <FaPlus style={{color: '#1A7FA8'}}*/}
                        {/*                size={'1.3em'}*/}
                        {/*            //         onClick={() => {*/}
                        {/*            //             setEditCustomer({*/}
                        {/*            //                 editShow: true,*/}
                        {/*            //                 customer: custom*/}
                        {/*            //             });*/}
                        {/*            //         }}*/}
                        {/*        />*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Typeahead*/}
                        {/*    minLength={3}*/}
                        {/*    onChange={(selected) => {*/}
                        {/*        // Handle selections...*/}
                        {/*    }}*/}
                        {/*    options={[ "Alabama", "Nebraska", "Malibu"]}*/}
                        {/*/>*/}

                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>Items
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <Row>
                                        <Col sm="3">
                                            <AsyncTypeahead
                                                id="async-example"
                                                labelKey="item"
                                                minLength={3}
                                                options={["Alabama", "Nebraska", "Malibu"]}
                                                placeholder="Search item..."
                                                onSearch={handleSearch}
                                            /></Col>
                                        <Col sm="3">
                                            <Form.Control disabled placeholder="label" type="text"/>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control placeholder="amount" type="text"/>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control placeholder="cost" type="text"/>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="1">
                                            <Button type="submit" className="primaryButton pull-right"
                                                // onClick={addCustomerHandler}
                                            >
                                                Add
                                            </Button>
                                        </Col>


                                    </Row>
                                    {item.length > 0 &&
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                        <tr>
                                            <th>Item upc</th>
                                            <th>Amount</th>
                                            <th>Cost</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/*<tr>*/}
                                        {/*    <td>Mark</td>*/}
                                        {/*    <td>Otto</td>*/}
                                        {/*    <td>@mdo</td>*/}
                                        {/*</tr>*/}
                                        </tbody>
                                    </Table>}
                                </Card.Text>
                            </Card.Body>
                        </Card>


                        <div className="float-right" style={{paddingRight: '10px'}}>
                            {/*<Button type="submit" className="mainButton pull-right"*/}
                            {/*    // onClick={addCustomerHandler}*/}
                            {/*>*/}
                            {/*    Save*/}
                            {/*</Button>*/}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );


}

export default ModalAddApplication;
