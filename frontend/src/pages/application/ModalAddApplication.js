import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import ErrorMessage from "../../messages/errorMessage";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Card from "react-bootstrap/Card";
import {AuthContext} from "../../context/authContext";
import {FaTrash} from "react-icons/fa";

function ModalAddApplication(props) {

    const [appDto, setApp] = useState({});
    const {user, setUser} = useContext(AuthContext);
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
        source: [],
        destination: []
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

    const deleteItem = (e) => {
        let afterDelete = [];
        item.forEach(i => {
            if (i.id != e.currentTarget.id) {
                afterDelete.push(i);
            }
        });
        setItems(afterDelete);
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
        fetch(`/customers/${user.currentCustomerId}/warehouses/type?type=FACTORY`)
            .then(response => response.json())
            .then(res => {
                setWarehouses(preState => ({
                        ...preState,
                        source: res
                    })
                );
            });
        fetch(`/customers/${user.currentCustomerId}/warehouses/type?type=WAREHOUSE`)
            .then(response => response.json())
            .then(res => {
                setWarehouses(preState => ({
                        ...preState,
                        destination: res
                    })
                );
            });
    }, []);


    const itemsTable =
        <React.Fragment>
            {item.length > 0 &&
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Item upc</th>
                    <th>Label</th>
                    <th>Amount</th>
                    <th>Cost</th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {item.map(i => (
                    <tr id={i.id} key={i.id}>
                        <td>{i.upc}</td>
                        <td>{i.label}</td>
                        <td>{i.amount}</td>
                        <td>{i.cost}</td>
                        <td style={{textAlign: 'center'}}>
                            <FaTrash id={i.id} style={{color: '#1A7FA8'}}
                                     onClick={deleteItem}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>}

        </React.Fragment>;


    const inputsAddItems =
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
                <Button id={currentItem && currentItem.id} type="submit"
                        variant="outline-primary"
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
        </Row>;

    const appDataFields =
        <Row>
            <Col sm={8}>
                <Form.Group as={Row} controlId="appNumber">
                    <Form.Label column sm="3">Number</Form.Label>
                    <Col sm="7">
                        <Form.Control type="text"/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid number.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="sourceLocation">
                    <Form.Label column sm="3">Source location</Form.Label>
                    <Col sm="7">
                        <Form.Control as="select">
                            {warehouses.source.map(f =>
                                <option id={f.id} key={f.id}>{f.identifier}{', '}
                                    {f.addressDto.city}{', '}
                                    {f.addressDto.addressLine1}</option>
                            )}
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="destinationLocation">
                    <Form.Label column sm="3">Destination location</Form.Label>
                    <Col sm="7">
                        <Form.Control as="select">
                            {warehouses.destination.map(f =>
                                <option id={f.id} key={f.id}>{f.identifier}{', '}
                                    {f.addressDto.city}{', '}
                                    {f.addressDto.addressLine1}</option>
                            )}
                        </Form.Control>
                    </Col>
                </Form.Group>
            </Col>
            <Col sm={2} style={{marginLeft: '-25px'}}>
                <Card style={{width: '11rem', borderLeft: '3px solid #009edd'}}>
                    <Card.Body>
                        <h6>Total amount of items</h6>
                        <Card.Text>
                            <h3>{totalValues.totalAmount}</h3>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={2}>
                <Card style={{width: '11rem', borderLeft: '3px solid #009edd'}}>
                    <Card.Body>
                        <h6>Total number of units</h6>
                        <Card.Text>

                            <h3> {totalValues.totalUnits}</h3>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    ;
    return (
        <>
            <Modal
                show={props.props}
                onHide={() => {
                    setErrors({
                        serverErrors: '',
                        validationErrors: []
                    });
                    setItems([]);
                    props.onChange(false);
                }}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Create supply application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        {appDataFields}
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>
                                {inputsAddItems}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {itemsTable}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="float-right" style={{padding: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                // onClick={addCustomerHandler}
                            >
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );


}

export default ModalAddApplication;