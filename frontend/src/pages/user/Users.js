import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import {FaEdit} from "react-icons/fa";
import Page from "../../components/Page";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import ModalAddUser from "./ModalAddUser";
import ModalEditUser from "./ModalEditUser";
import CardContainer from "../../components/CardContainer";
import ErrorMessage from "../../messages/errorMessage";

export default () => {

    const currentCustomerId = localStorage.
    getItem("currentCustomerId") != null ? localStorage.
    getItem("currentCustomerId"): 0;

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState([]);
    const [addUserShow, setAddUserShow] = useState(false);
    const [editUser, setEditUser] = useState({
        editShow: false,
        user: []
    });
    const [errorMessage, setErrors] = useState('');
    const filterOptions = {'All': '', 'Active': true, 'Disabled': false};

    const onChangeFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
        getUsers(`/customers/${currentCustomerId}/users?status=${e.target.value}&size=${page.countPerPage}`);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getUsers(`/customers/${currentCustomerId}/users?size=${e.target.value}&status=${filter}`);
    };

    const handleChangeStatus = (e) => {
        let status = e.target.value !== 'true';
        let id = e.target.id;
        fetch(`/customers/${currentCustomerId}/users/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(status)
        })
            .then(function (response) {
                if (response.status !== 200) {
                    setErrors("Something go wrong, try later");
                } else {
                    let newData = [...users];
                    newData.forEach(elem => {
                        if (elem.id == id) {
                            elem.active = status;
                        }
                    });
                    setUsers(newData);
                }
            });
    };


    const changePage = (e) => {
        e.preventDefault();
        let page = e.target.innerHTML - 1;
        getUsers(`/customers/${currentCustomerId}/users?page=${page}&status=${filter}`);
    };

    useEffect(() => {
        getUsers('/customers/'+currentCustomerId+'/users');
    }, []);


    function getUsers(url) {

        fetch(url)
            .then(response => response.json())
            .then(commits => {
                console.log(commits.content);
                setUsers(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const closeModalAdd = (e, customerDto) => {
        setAddUserShow(e);
        if (customerDto) {
            getUsers(`/customers/${currentCustomerId}/users?status=${filter}&size=${page.countPerPage}`);
        }
    };

    const closeModalEdit = (e, customerDto) => {
        setEditUser(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (customerDto) {
            getUsers(`/customers/${currentCustomerId}/users?status=${filter}&size=${page.countPerPage}`);
        }
    };


    const tableRows = users.map(custom => (
        <tr key={custom.id}>
            <td>{custom.name} {custom.surname}</td>
            <td>{custom.birthday}</td>
            <td>{custom.role}</td>
            <td><Form.Check
                type="switch"
                id={custom.id}
                style={{width: '25px'}}
                onChange={handleChangeStatus}
                checked={custom.active}
                value={custom.active}
            />
            </td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditUser({
                                editShow: true,
                                user: custom
                            });
                        }}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalAddUser props={addUserShow} onChange={closeModalAdd}/>
            <ModalEditUser props={editUser} onChange={closeModalEdit}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => setAddUserShow(true)}>
                        Add
                    </Button>
                </Col>
                <Col md={7}></Col>
                <Col md={2}>
                    <Form.Control size="sm" as="select"
                                  value={filter}
                                  defaultValue="Choose..."
                                  onChange={onChangeFilter}>
                        {Object.entries(filterOptions).map(([k, v]) => (
                            <option value={v}>{k}</option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md={1}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>
        </React.Fragment>;

    const body =
        <React.Fragment>
            <Table hover size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birthday</th>
                        <th>Role</th>
                        <th>status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
            <Page page={page} onChange={changePage}/>
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );

}
