import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import ErrorMessage from "../../messages/errorMessage";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FaPlus} from "react-icons/fa";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

function ModalAddApplication(props) {

    const [appDto, setApp] = useState({});

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [options, setOptions] = useState([]);

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
                size="lg"
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
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
                        {/*<Form.Group controlId="appType" style={{padding: '5px 10px'}}>*/}
                        {/*    <Form.Control as="select">*/}
                        {/*        <option>Default select</option>*/}
                        {/*    </Form.Control>*/}
                        {/*</Form.Group>*/}
                        <Form.Group controlId="appNumber" style={{padding: '5px 10px'}}>
                            <Form.Control type="email" placeholder="App number"/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid number.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row style={{padding: '0px 10px'}}>
                            <Col>
                                <h6>Items</h6>
                            </Col>
                            <Col style={{textAlign: 'end'}}>
                                <FaPlus style={{color: '#1A7FA8'}}
                                        size={'1.3em'}
                                    //         onClick={() => {
                                    //             setEditCustomer({
                                    //                 editShow: true,
                                    //                 customer: custom
                                    //             });
                                    //         }}
                                />
                            </Col>
                        </Row>
                        <hr/>
                        {/*<Typeahead*/}
                        {/*    minLength={3}*/}
                        {/*    onChange={(selected) => {*/}
                        {/*        // Handle selections...*/}
                        {/*    }}*/}
                        {/*    options={[ "Alabama", "Nebraska", "Malibu"]}*/}
                        {/*/>*/}
                        <AsyncTypeahead
                            id="async-example"
                            labelKey="item"
                            minLength={3}
                            options={["Alabama", "Nebraska", "Malibu"]}
                            placeholder="Search item..."
                            onSearch={handleSearch}
                            style={{padding: '10px', width: "40%"}}
                        />

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
                        </Table>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                // onClick={addCustomerHandler}
                            >
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );


}

export default ModalAddApplication;
