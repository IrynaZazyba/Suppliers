import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form'
import {FaEdit} from "react-icons/fa";
import Page from "../../components/Page";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import ModalAddRetailer from "./ModalAddRetailer";
import ModalEditRetailer from "./ModalEditRetailer";
import CardContainer from "../../components/CardContainer";
import ErrorMessage from "../../messages/errorMessage";


export default () => {

    const currentCustomerId = localStorage.getItem("currentCustomerId") != null ? localStorage.getItem("currentCustomerId") : 0;

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [retailers, setRetailers] = useState([]);
    const [filter, setFilter] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editRetailer, setEditRetailer] = useState({
        editShow: false,
        retailer: []
    });
    const [errorMessage, setErrors] = useState('');
    const filterOptions = {'All': '', 'Active': true, 'Disabled': false};

    const onChangeFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
        getRetailers(`/customers/${currentCustomerId}/retailers?status=${e.target.value}&size=${page.countPerPage}`);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getRetailers(`/customers/${currentCustomerId}/retailers?size=${e.target.value}&status=${filter}`);
    };

    const handleChangeStatus = (e) => {
        let status = e.target.value !== 'true';
        let id = e.target.id;
        fetch(`/customers/${currentCustomerId}/retailers/${id}/status`, {
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
                    let newData = [...retailers];
                    newData.forEach(elem => {
                        if (elem.id == id) {
                            elem.active = status;
                        }
                    });
                    setRetailers(newData);
                }
            });
    };
    const closeModalEdit = (e, customerDto) => {
        setEditRetailer(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (customerDto) {
            getRetailers(`/customers/${currentCustomerId}/retailers?status=${filter}&size=${page.countPerPage}`);
        }
    };


    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getRetailers(`/customers/${currentCustomerId}/retailers?page=${currentPage}&status=${filter}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getRetailers(`/customers/${currentCustomerId}/retailers`);
    }, []);


    function getRetailers(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setRetailers(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const closeModalAdd = (e, customerDto) => {
        setLgShow(e);
        if (customerDto) {
            getRetailers(`/customers/${currentCustomerId}/retailers?status=${filter}&size=${page.countPerPage}`);
        }
    };


    const tableRows = retailers.map(retailer => (
        <tr key={retailer.id}>
            <td>{retailer.fullName}</td>
            <td>{retailer.identifier}</td>
            <td><Form.Check
                type="switch"
                id={retailer.id}
                style={{width: '25px'}}
                onChange={handleChangeStatus}
                checked={retailer.active}
                value={retailer.active}
            />
            </td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditRetailer({
                                editShow: true,
                                retailer: retailer
                            });
                        }}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalAddRetailer props={lgShow} onChange={closeModalAdd}/>
            <ModalEditRetailer contentClassName="custom-modal-style" props={editRetailer} onChange={closeModalEdit}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
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
                    <th> Full name</th>
                    <th>Identifier</th>
                    <th>Status</th>
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
