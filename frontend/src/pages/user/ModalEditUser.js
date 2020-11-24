import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validateUserName from "../../validation/UserValidationRules";
import ErrorMessage from "../../messages/errorMessage";

function ModalEditUser(props) {

    const [userDto, setUser] = useState({
        id: '',
        name: '',
        surname:'',
        birthday: ''
    });
    const [validError, setError] = useState([]);
    const [errorMessage, setErrors] = useState('');

    const handleName = (e) => {
        setUser(preState => ({
            ...preState,
            name: e.target.value
        }));
    };
    const handleSurname = (e) => {
        setUser(preState => ({
            ...preState,
            surname: e.target.value
        }));
    };

    const handleBirthday = (e) => {
        setUser(preState => ({
            ...preState,
            birthday: e.target.value
        }));
    };

    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId"): 0;

    useEffect(() => {
        if (props.props.editShow) {
            fetch("customers/" +  currentCustomerId + "/users/" + props.props.user.id)
                .then(response => response.json())
                .then(res => {
                    setUser(res);
                });
        }
    }, [props.props.editShow]);


    const editUserHandler = (e) => {
        e.preventDefault();

               fetch("customers/" +  currentCustomerId + "/users/" + userDto.id, {
                   method: 'PUT',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(userDto)
               })
                   .then((response) => {
                       if (response.status !== 200) {
                           setError('');
                           setErrors("Something go wrong, try later");
                       } else {
                           setError('');
                           props.onChange(false, userDto);
                       }
                   });

    };
    const isValid = (param) => validError.includes(param) ? "form-control is-invalid" : "form-control";

    return (
        <>
            <Modal
                show={props.props.editShow}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-custom"
                className="shadow"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Edit user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    <Form>
                        <Form.Group controlId="editUserr" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="name"
                                          onChange={handleName}
                                          value={userDto.name}
                                          className={
                                              isValid("name")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid  name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Control type="text"
                                          placeholder="surname"
                                          onChange={handleSurname}
                                          value={userDto.surname}
                                          className={
                                              isValid("surname")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid  surname.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="editUser" style={{padding: '5px 10px'}}>
                            <Form.Control type="date" placeholder="birthday" onChange={handleBirthday}
                                          className={
                                              isValid("birthday")
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid date.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editUserHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditUser;