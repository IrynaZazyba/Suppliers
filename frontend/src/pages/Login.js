import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form'
import {AuthContext} from "../context/authContext";
import RequestService from "../services/requestService";
import ErrorMessage from "../messages/errorMessage";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {Redirect} from "react-router-dom";
import validateLoginForm from "../validation/LoginFormValidationRules";

export default (props) => {
    const {user, setUser} = useContext(AuthContext);
    const prevPageLocation = props?.history?.location?.state?.from || '/';
    const [fields, setField] = useState({
        username: '',
        password: ''
    });
    const [loginState, changeLoginState] = useState({
        user: null,
        loginFailed: false,
        errorMessage: '',
        errors: []
    });

    const requestService = new RequestService();

    const onError = () => {
        changeLoginState(preState => ({
            ...preState,
            loginFailed: true,
            errorMessage: "Invalid login or password. Please, try again."
        }));
    };

    const handleInput = (fieldName) =>
        (e) => {
            const value = e.target.value;
            setField(preState => ({
                ...preState,
                [fieldName]: value
            }))
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorFields = validateLoginForm(fields);
        changeLoginState(prevState => {
            return {...prevState, errors: errorFields};
        });

        if (errorFields.length === 0) {
            requestService.postResource("/login", fields)
                .then(res => setUser({
                    username: res.username
                }))
                .catch(error => onError());
        }
    };

    const loginForm = (
        <div style={{margin: '70px 550px'}}>
            <Card style={{width: '25rem'}}
                  className="shadow p-3 mb-5 bg-white rounded">
                <Card.Header className="text-center border-bottom border-primary" style={{'background': 'white'}}>
                    Log in
                </Card.Header>
                <Card.Body>
                    {loginState.errorMessage && <ErrorMessage message={loginState.errorMessage}/>}
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="email"
                                          required
                                          placeholder="Email"
                                          value={fields['username']}
                                          onChange={handleInput('username')}
                                          className={
                                              loginState.errors.includes("username")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password"
                                          required
                                          placeholder="Password"
                                          value={fields['password']}
                                          onChange={handleInput('password')}
                                          className={
                                              loginState.errors.includes("password")
                                                  ? "form-control is-invalid"
                                                  : "form-control"
                                          }/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" size="md" block
                                type="submit"
                                onClick={handleSubmit}>
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );

    return user ? <Redirect to={prevPageLocation}/> : loginForm;
}