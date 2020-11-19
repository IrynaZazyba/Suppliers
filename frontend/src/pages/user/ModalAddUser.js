import {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../../messages/errorMessage";

function ModalAddUser(props) {


    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const [state, setState] = useState([]);

    const [states, setStates] = useState([]);

    const [addressDto, setAddressDto] = useState({
        city: '',
        state: null,
        addressLine1: '',
        addressLine2: ''
    });
    const [userDto, setUser] = useState({
        name: '',
        surname: '',
        birthday: '',
        addressDto: addressDto,
        role: 'ROLE_SYSTEM_ADMIN',
        username: '',
        email: '',
        password:'',
        customerId: currentCustomerId
    });
    const [validError, setError] = useState([]);
    const [errorMessage, setErrors] = useState('');

    const onChangeState = (e) => {
        const selectedState = states.find(state => state.state === e.target.value);

        setState(preState => ({
            ...preState,
            state: selectedState
        }));
        console.log(selectedState);
        setAddressDto(preState => ({
            ...preState,
            state: selectedState
        }));
    };
    useEffect(() => {


        fetch('/states')
            .then(response => response.json())
            .then(commits => {
                setStates(commits.content);
            });
    });

    const handleName = (e) => {
        setUser(preState => ({
            ...preState,
            name: e.target.value
        }));
    };
    const handlePassword = (e) => {
        setUser(preState => ({
            ...preState,
            password: e.target.value
        }));
    };
    const handleSurname = (e) => {
        setUser(preState => ({
            ...preState,
            surname: e.target.value
        }));
    };
    const handleUsername = (e) => {
        setUser(preState => ({
            ...preState,
            username: e.target.value
        }));
    };
    const handleBirthday = (e) => {
        setUser(preState => ({
            ...preState,
            birthday: e.target.value
        }));
    };
    const handleRole = (e) => {
        console.log(e.target.value);
        setUser(preState => ({
            ...preState,
            role: e.target.value
        }));
    };
    const handleEmail = (e) => {
        setUser(preState => ({
            ...preState,
            email: e.target.value
        }));
    };
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
        setUser(preState => ({
            ...preState,
            addressDto: addressDto
        }));
    };
    const addUserHandler = (e) => {
        e.preventDefault();
        console.log(currentCustomerId);
        console.log(userDto);
        console.log(addressDto);


        fetch('customers/' + currentCustomerId + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDto)
        })
            .then(function (response) {
                if (response.status !== 201) {
                    setError('');
                    setErrors("Something go wrong, try later");
                } else {
                    setError('');
                    props.onChange(false, userDto);
                }
            });
    };

    return (
        <>
            <Modal
                show={props.props}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Add user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    <Form>
                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="name" onChange={handleName}
                                          className={
                                              validError.includes("name")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="surname" onChange={handleSurname}
                                          className={
                                              validError.includes("surnname")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid surname.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="username" onChange={handleUsername}
                                          className={
                                              validError.includes("surname")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid username.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="password" onChange={handlePassword}
                                          className={
                                              validError.includes("password")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicDate" style={{padding: '5px 10px'}}>
                            <Form.Control type="date" placeholder="birthday" onChange={handleBirthday}
                                          className={
                                              validError.includes("birthday")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid date.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Control style={{padding: '5px 10px '}} as="select"
                                      defaultValue="Choose..."
                                      onChange={handleRole}>

                            <option value={"ROLE_SYSTEM_ADMIN"}>ROLE_SYSTEM_ADMIN</option>
                            <option value={"ROLE_ADMIN"}>ROLE_ADMIN</option>
                            <option value={"ROLE_DISPATCHER"}>ROLE_DISPATCHER</option>
                            <option value={"ROLE_LOGISTICS_SPECIALIST"}>ROLE_LOGISTICS_SPECIALIST</option>
                            <option value={"ROLE_DRIVER"}>ROLE_DRIVER</option>
                            <option value={"ROLE_DIRECTOR"}>ROLE_DIRECTOR</option>
                        </Form.Control>

                        <Form.Control style={{padding: '5px 10px'}} as="select"
                                      defaultValue="Choose..."
                                      onChange={onChangeState}>
                            {Object.entries(states).map(([k, v]) => (

                                <option>{v.state}</option>

                            ))}
                        </Form.Control>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="city" onChange={handleCity}
                                          className={
                                              validError.includes("city")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine1" onChange={handleaddressLine1}
                                          className={
                                              validError.includes("addressLine1")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 1.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicText" style={{padding: '5px 10px'}}>
                            <Form.Control type="text" placeholder="addressLine2" onChange={handleaddressLine2}
                                          className={
                                              validError.includes("addressLine2")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid address line 2.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="formBasicEmail" style={{padding: '5px 10px'}}>
                            <Form.Control type="email" placeholder="email" onChange={handleEmail}
                                          className={
                                              validError.includes("email")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={addUserHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddUser;