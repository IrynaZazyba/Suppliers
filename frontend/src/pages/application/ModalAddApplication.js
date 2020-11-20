import React, {useEffect, useState} from 'react';
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
    const [currentItem, setCurrentItem] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalValues, setTotalValues] = useState({
        totalAmount: '',
        totalUnits: ''
    });

    const [warehouses, setWarehouses] = useState({
        source: '',
        destination: ''
    });

    const handleSearch = (query) => {
        setIsLoading(true);
        fetch(`customers/3/item/upc?upc=${query}`)
            .then(resp => resp.json())
            .then(res => {
                const optionsFromBack = res.map((i) => ({
                    id: i.id,
                    upc: i.upc,
                    label: i.label,
                    units: i.units
                }));

                setOptions(optionsFromBack);
                setIsLoading(false);

            });
    };
    const filterBy = () => true;

    const onChangeUpc = (e) => {
        e.length > 0 ? setCurrentItem(e[0]) : setCurrentItem('');
    };

    const handleInput = (fieldName) =>
        (e) => {
            const value = e.target.value;
            console.log(currentItem);
            setCurrentItem(preState => ({
                ...preState,
                [fieldName]: value
            }))
        };

    useEffect(() => {
        setCurrentItem('');
        setTotalValues(preState => ({
                ...preState,
                totalAmount: item.reduce((totalAmount, i) => totalAmount + parseInt(i.amount), 0),
                totalUnits: item.reduce((totalUnits, i) => totalUnits + parseFloat(i.units), 0)
            })
        );
    }, [item]);


    useEffect(() => {
        if (props.props.editShow === true) {
            fetch(`/customers/${props.props.customer.id}/warehouses/type?type=`)
                .then(response => response.json())
                .then(res => {
                    console.log(res);
                });
        }
    }, []);


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
                        <Form.Group as={Row} controlId="totalAmount">
                            <Form.Label column sm="2">Total amount of items</Form.Label>
                            <Col sm="5">
                                <Form.Control disabled placeholder="Total amount of items" type="text"
                                              value={totalValues.totalAmount}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="totalUnits">
                            <Form.Label column sm="2">Total number of items</Form.Label>
                            <Col sm="5">
                                <Form.Control disabled placeholder="Total amount of units" type="text"
                                              value={totalValues.totalUnits}/>
                            </Col>
                        </Form.Group>
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>Items
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <Row>
                                        <Col sm="3">
                                            <AsyncTypeahead
                                                filterBy={filterBy}
                                                id="async-example"
                                                labelKey="upc"
                                                isLoading={isLoading}
                                                minLength={3}
                                                options={options}
                                                placeholder="Search item..."
                                                onSearch={handleSearch}
                                                onChange={onChangeUpc}
                                                value={currentItem.upc}
                                            />


                                        </Col>
                                        <Col sm="3">
                                            <Form.Control disabled placeholder="label" type="text"
                                                          value={currentItem && currentItem.label}/>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control placeholder="amount" type="text"
                                                          value={currentItem && currentItem.amount}
                                                          onChange={handleInput('amount')}/>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control placeholder="cost" type="text"
                                                          value={currentItem && currentItem.cost}
                                                          onChange={handleInput('cost')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid number.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="1">
                                            <Button type="submit" variant="outline-primary"
                                                    className="primaryButton"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        //todo validate empty field
                                                        setItems([
                                                            ...item, currentItem
                                                        ]);
                                                        setCurrentItem('');
                                                    }}
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
                                            <th>Label</th>
                                            <th>Amount</th>
                                            <th>Cost</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {item.map(i => (
                                            <tr id={i.id} key={i.id}>
                                                <td>{i.upc}</td>
                                                <td>{i.label}</td>
                                                <td>{i.amount}</td>
                                                <td>{i.cost}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>}
                                </Card.Text>
                            </Card.Body>
                        </Card>


                        {/*<div className="float-right" style={{paddingRight: '10px'}}>*/}
                        {/*    /!*<Button type="submit" className="mainButton pull-right"*!/*/}
                        {/*    /!*    // onClick={addCustomerHandler}*!/*/}
                        {/*    /!*>*!/*/}
                        {/*    /!*    Save*!/*/}
                        {/*    /!*</Button>*!/*/}
                        {/*</div>*/}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );


}

export default ModalAddApplication;