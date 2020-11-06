import React from 'react';
import Pagination from 'react-bootstrap/Pagination'

function Page(props) {

    let active = props.page.active;
    let items = [];
    for (let number = 1; number <= props.page.countPages; number++) {
        items.push(
                <Pagination.Item key={number} onClick={(event) => props.onChange(event)} active={number === active}>
                    {number}
                </Pagination.Item>
        );
    }


    return (
        <div className="center">
            <Pagination size="sm">{items}</Pagination>
        </div>
    );
}

export default Page;