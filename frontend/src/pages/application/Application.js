import React, {useEffect, useState} from 'react';
import CardContainer from "../../components/CardContainer";
import Table from "react-bootstrap/Table";
import {FaEdit} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TogglePage from "../../components/TogglePage";
import Page from "../../components/Page";
import Form from 'react-bootstrap/Form'
import ErrorMessage from "../../messages/errorMessage";
import ModalEditApplication from "./ModalEditApplication";
import ModalAddApplication from "./ModalAddApplication";

export default () => {

    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [filter, setFilter] = useState([]);
    const filterOptions = {
        'Open': 'OPEN',
        'Started processing': 'STARTED_PROCESSING',
        'Finished processing': 'FINISHED_PROCESSING'
    };
    const [errorMessage, setErrors] = useState('');
    const [editApplication, setEditApplication] = useState({
        editShow: false,
        application: []
    });
    const [lgShow, setLgShow] = useState(false);


    useEffect(() => {
        getApplications(`/application/admin`);
    }, []);


    function getApplications(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setApplications(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const onChangeFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
        getApplications(`/application/admin?status=${e.target.value}&size=${page.countPerPage}`);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getApplications(`/application/admin?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getApplications(`/application/admin?page=${currentPage}&size=${page.countPerPage}&status=${filter}`);
    };

    const closeModalEdit = (e, appDto) => {
        setEditApplication(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (appDto) {
            getApplications(`/application/admin?page=${page.currentPage}&size=${page.countPerPage}`);
        }
    };

    const closeModalAdd = (e, appDto) => {
        setLgShow(e);
        if (appDto) {
            getApplications(`/application/admin?page=${page.currentPage}&size=${page.countPerPage}`);
        }
    };

    const tableRows = applications.map(app => (
        <tr key={app.id}>
            <td>{app.number}</td>
            <td></td>
            <td></td>
            <td>{app.lastUpdated}</td>
            <td>{app.lastUpdatedByUsersDto.surname}</td>
            <td>{app.applicationStatus}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditApplication({
                                editShow: true,
                                application: app
                            });
                        }}
            />
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalEditApplication props={editApplication} onChange={closeModalEdit}/>
            <ModalAddApplication props={lgShow} onChange={closeModalAdd}/>

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
                    <th>Number</th>
                    <th>Source location</th>
                    <th>Destination location</th>
                    <th>Last update date</th>
                    <th>Updated by</th>
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