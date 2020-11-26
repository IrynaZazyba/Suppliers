import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/authContext";
import Page from "../../components/Page";
import {FaEdit} from "react-icons/fa";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import ModalAddCategory from "./ModalAddCategory";
import ModalEditCategory from "./ModalEditCategory";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";

export default () => {

    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [categories, setCategory] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editCategory, setEditCategory] = useState({
        editShow: false,
        customer: []
    });
    const [errorMessage, setErrors] = useState('');

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getCategories(`/customers/${currentCustomerId}/category?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getCategories(`/customers/${currentCustomerId}/category?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getCategories(`/customers/${currentCustomerId}/category?size=${page.countPerPage}`);
    }, []);

    function getCategories(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setCategory(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const closeModalAdd = (e, categoryDto) => {
        setLgShow(e);
        if (categoryDto) {
            getCategories(`/customers/${currentCustomerId}/category?size=${page.countPerPage}`);
        }
    };

    const closeModalEdit = (e, categoryDto) => {
        setEditCategory(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (categoryDto) {
            getCategories(`/customers/${currentCustomerId}/category?size=${page.countPerPage}`);
        }
    };

    const tableRows = categories.map(category => (
        <tr key={category.id}>
            <td onClick={() => document.location.href=`/customers/${currentCustomerId}/warehouse/3`}>{category.category}</td>
            <td>{category.taxRate}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditCategory({
                                editShow: true,
                                category: category
                            });
                        }}/>
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
            <ModalAddCategory props={lgShow} onChange={closeModalAdd}/>
            <ModalEditCategory props={editCategory} onChange={closeModalEdit}/>
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col md={2}>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>
                </Col>
                <Col md={9}></Col>
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
                    <th>Category</th>
                    <th>Tax Rate(per km)</th>
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
