import React from 'react';
import Pagination from 'react-bootstrap/Pagination'

function Page() {

    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item  key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }


    return (
        <div className="center">
            <Pagination size="sm">{items}</Pagination>
        </div>
    );
}

export default Page;