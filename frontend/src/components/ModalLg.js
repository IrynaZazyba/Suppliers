import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../messages/errorMessage";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";

function ModalLg(props) {

    // const {isOpen,appDataFields, inputsAddItems, itemsTable, button} = props;
    // console.log("///////////");
    //
    // console.log(props);
    const {isOpen, title, itemsTable, appDataFields, status} = props;

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    const onHideModal = () => {
        setErrors({
            serverErrors: '',
            validationErrors: []
        });
        isOpen.onChange(false)
    };

    return (
        <>
            <Modal
                show={isOpen.props.isOpen}
                onHide={onHideModal}
                aria-labelledby="modal-custom"
                className="shadow"
                dialogClassName="app-modal"
                centered
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-custom">
                        {title}
                        <span>
                        <Badge className="badge-status" style={{color: '#009edd'}}>
                            {status}
                        </Badge>
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        {appDataFields}
                        <div className="validation-error">
                            {errors.validationErrors.includes("items") ? "Items shouldn't be empty" : ""}
                        </div>
                        <Card border="primary" style={{width: '100%'}}>
                            <Card.Header>
                                {/*{inputsAddItems}*/}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {itemsTable}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="float-right" style={{padding: '10px'}}>
                            {/*{button}*/}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default ModalLg;
