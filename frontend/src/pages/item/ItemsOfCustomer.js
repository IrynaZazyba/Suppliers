import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/authContext";
import Page from "../../components/Page";
import {FaEdit} from "react-icons/fa";
import React from "react";
import ErrorMessage from "../../messages/errorMessage";
import ModalAddItem from "./ModalAddItem";
import ModalEditItem from "./ModalEditItem";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TogglePage from "../../components/TogglePage";
import CardContainer from "../../components/CardContainer";
import {FaTrash} from "react-icons/fa";

export default () => {

    const [currentCustomerId, setSelected] = useState(JSON.parse(localStorage.getItem('user')).customers[0].id);

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });
    const [items, setItems] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editItem, setEditItem] = useState({
        editShow: false,
        customer: []
    });
    const [errors, setErrors] = useState({
        errorMessage: ''
    });

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getItems(`/customers/${currentCustomerId}/item?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        setPage(preState => ({
            ...preState,
            currentPage: e.target.innerHTML - 1
        }));
        getItems(`/customers/${currentCustomerId}/item?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getItems(`/customers/${currentCustomerId}/item?size=${page.countPerPage}`);
    }, []);

    function getItems(url) {
        setErrors('');
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setItems(commits.content);
                setPage({
                    active: (commits.pageable.pageNumber + 1),
                    countPerPage: commits.size,
                    countPages: commits.totalPages
                });
            });
    }

    const closeModalAdd = (e, itemDto) => {
        setLgShow(e);
        if (itemDto) {
            getItems(`/customers/${currentCustomerId}/item?size=${page.countPerPage}`);
        }
    };

    const closeModalEdit = (e, itemDto) => {
        setEditItem(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (itemDto) {
            getItems(`/customers/${currentCustomerId}/item?size=${page.countPerPage}`);
        }
    };

    function deleteItem(idOfItem) {
        fetch(`/customers/${currentCustomerId}/item/${idOfItem}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 204) {
                setErrors({
                    errorMessage: "Item can not be deleted, because it is already used in application"
                });
            } else {
                let raw = document.getElementById(`item${idOfItem}`);
                raw.style.opacity = '0.3';
                raw.style.background = '#656662';
                setErrors(preState => ({
                    ...preState,
                    errorMessage: ''
                }));
            }
        });
    }

    const tableRows = items.map(item => (
        <tr id={`item${item.id}`} key={item.id}>
            <td>{item.label}</td>
            <td>{item.units}</td>
            <td>{item.categoryDto.category}</td>
            <td>{item.upc}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditItem({
                                editShow: true,
                                item: item
                            });
                        }}/>
            </td>
            <td><FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                         onClick={() => {
                             deleteItem(item.id);
                         }}
            />
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
            <ModalAddItem props={lgShow} onChange={closeModalAdd}/>
            <ModalEditItem props={editItem} onChange={closeModalEdit}/>
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
                    <th>Label</th>
                    <th>Units</th>
                    <th>Category</th>
                    <th>Cost per unit</th>
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