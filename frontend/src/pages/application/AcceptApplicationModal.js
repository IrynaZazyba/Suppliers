import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

function AcceptApplicationModal(props) {


    return (
        <>
            <Modal
                show={props.props}
                onHide={() => props.onChange(false)}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        Accept application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="validation-error">
                        </div>
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="float-right" style={{padding: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                // onClick={addAppHandler}
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

export default AcceptApplicationModal;