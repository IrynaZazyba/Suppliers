import React from 'react';
import Pagination from 'react-bootstrap/Pagination'

function Page(props) {

    console.log(props)
    let active = props.page.active;
    let items = [];
    for (let number = 1; number <= props.page.countPages; number++) {
        items.push(
            <a href="#" key={number} onClick={(event) => props.onChange(event)}>
                <Pagination.Item key={number} active={number === active}>
                    {number}
                </Pagination.Item>
            </a>,
        );
    }


    return (
        <div className="center">
            <Pagination size="sm">{items}</Pagination>
        </div>
    );
}

export default Page;