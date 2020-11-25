import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddCar(props) {

    const ref = React.createRef();
    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [carDto, setCar] = useState({
        number: '',
        totalCapacity: '',
        currentCapacity: '',
        customerId: currentCustomerId
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });
    const [zone, setZone] = useState([]);

    const [zones, setZones] = useState([]);

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: null,
        addressLine1: '',
        addressLine2: ''
    });

    const [options, setOptions] = useState([]);

    const filterBy = () => true;


    const handleNumber = (e) => {
        setCar(preState => ({
            ...preState,
            number: e.target.value
        }));
    };
    const handleTotalCapacity = (e) => {
        setCar(preState => ({
            ...preState,
            totalCapacity: e.target.value,
            currentCapacity: e.target.value
        }));
    };
    const onChangeState = (e) => {
        const selectedState = zones.find(state => state.state === e.target.value);

        setZone(preState => ({
            ...preState,
            state: selectedState
        }));
        setAddressDto(preState => ({
            ...preState,
            state: selectedState
        }));
    };
    useEffect(() => {


        fetch('/states')
            .then(response => response.json())
            .then(commits => {
                setZones(commits.content);
            });
    }, []);
    const handleCity = (e) => {
        setAddressDto(preState => ({
            ...preState,
            city: e.target.value
        }));
    };
    const handleaddressLine1 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine1: e.target.value
        }));
    };
    const handleaddressLine2 = (e) => {
        setAddressDto(preState => ({
            ...preState,
            addressLine2: e.target.value
        }));
        setCar(preState => ({
            ...preState,
            addressDto: addressDto
        }));
    };
    const isValid = (param) => errors.validationErrors.includes(param) ? "form-control is-invalid" : "form-control";

    const addCarHandler = (e) => {
        e.preventDefault();
        setErrors(preState => ({
            ...preState,
            validationErrors: ''
        }));
        console.log(carDto);
        fetch(`/customers/${currentCustomerId}/car`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carDto)
        })
            .then(response => {
                if (response.status !== 200) {
                    setErrors({
                        serverErrors: "Something went wrong, try later",
                        validationErrors: ''
                    });
                } else {
                    setErrors(preState => ({
                        ...preState,
                        validationErrors: []
                    }));
                    props.onChange(false, carDto);
                }
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
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add car
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="formBasicLabel" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="Number" onChange={handleNumber}
                                          className={
                                              isValid("number")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicCapacity" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="Total capacity"
                                          onChange={handleTotalCapacity}
                                          className={
                                              isValid("totalCapacity")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid total capacity.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Control style={{padding: '5px 10px'}} as="select"
                                      defaultValue="Choose..."
                                      onChange={onChangeState}>
                            {Object.entries(zones).map(([k, v]) => (

                                <option>{v.state}</option>

                            ))}
                        </Form.Control>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="city" onChange={handleCity}
                                          className={
                                              isValid("city")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine1" onChange={handleaddressLine1}
                                          className={
                                              isValid("addressLine1")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine2" onChange={handleaddressLine2}
                                          className={
                                              isValid("addressLine2")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addCarHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddCar;
