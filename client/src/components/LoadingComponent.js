import React from 'react'
import { Spinner } from 'react-bootstrap'

function LoadingComponent() {
    return (

        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading &hellip;</span>
        </Spinner>
    )
}

export default LoadingComponent;
