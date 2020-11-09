import React from 'react';
import {Redirect, useLocation} from 'react-router-dom';

export default function ProtectedComponent({conditions, render}) {
    const location = useLocation();

    return conditions
        ? render()
        : <Redirect to={{
            pathname: '/login',
            state: {from: location.pathname}
        }}/>
}
