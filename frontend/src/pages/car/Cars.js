import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import {FaEdit, FaTrash} from "react-icons/fa";
import ErrorMessage from "../../messages/errorMessage";
import ModalAddCar from "./ModalAddCar";
import ModalEditCar from "./ModalEditCar";
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
    const [cars, setCars] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editCar, setEditCar] = useState({
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
        getItems(`/customers/${currentCustomerId}/car?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        setPage(preState => ({
            ...preState,
            currentPage: e.target.innerHTML - 1
        }));
        getItems(`/customers/${currentCustomerId}/car?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getItems(`/customers/${currentCustomerId}/car?size=${page.countPerPage}`);
    }, []);

    function getItems(url) {
        setErrors('');
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                console.log(commits.content)
                setCars(commits.content);
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
            getItems(`/customers/${currentCustomerId}/car?size=${page.countPerPage}`);
        }
    };

    const closeModalEdit = (e, itemDto) => {
        setEditCar(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (itemDto) {
            getItems(`/customers/${currentCustomerId}/car?size=${page.countPerPage}`);
        }
    };

    function deleteCar(idOfCar) {
        fetch(`/customers/${currentCustomerId}/car/${idOfCar}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 204) {
                setErrors({
                    errorMessage: "Car can not be deleted"
                });
            } else {
                let raw = document.getElementById(`car${idOfCar}`);
                raw.style.opacity = '0.3';
                raw.style.background = '#656662';
                setErrors(preState => ({
                    ...preState,
                    errorMessage: ''
                }));
            }
        });
    }

    const tableRows = cars.map(car => (
        <tr id={`car${car.id}`} key={car.id}>
            <td>{car.number}</td>
            <td>{car.totalCapacity}</td>
            <td>{car.currentCapacity}</td>
            <td>{car.addressDto.state.state}, {car.addressDto.city}, {car.addressDto.addressLine1}, {car.addressDto.addressLine2}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1A7FA8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditCar({
                                editShow: true,
                                item: car
                            });
                        }}/>
            </td>
            <td><FaTrash style={{color: '#1A7FA8', textAlign: 'center'}}
                         onClick={() => {
                             deleteCar(car.id);
                         }}
            />
            </td>
        </tr>
    ));

    const modals =
        <React.Fragment>
            {errors.errorMessage && <ErrorMessage message={errors.errorMessage}/>}
            <ModalAddCar props={lgShow} onChange={closeModalAdd}/>
            <ModalEditCar props={editCar} onChange={closeModalEdit}/>
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
                    <th>Number</th>
                    <th>Total capacity</th>
                    <th>Available capacity</th>
                    <th>Address</th>
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