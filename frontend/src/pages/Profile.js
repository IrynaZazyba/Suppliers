import React from 'react';
import Alert from 'react-bootstrap/Alert'

export default () => {
    return (
        <div style={{
            margin: '70px 10px',
            height: '40px'
        }}>
            <Alert variant="success">
                <Alert.Heading>Welcome</Alert.Heading>
            </Alert>
        </div>
    )
}
