import React from 'react'
import { Link } from 'react-router-dom'

function OpenAccount() {
    return (
        <div className='container p-5 mb-5'>
            <div className='row text-center'>
                <h1 className='mt-5'>404 Not Found</h1>
                <p>Sorry the page you are looking for does not exists</p>
                <Link to="/signup">
                    <button className=' mb-5 p-2 btn btn-primary fs-5' style={{ width: "100%" }}>Sign up Now</button>
                </Link>
            </div>
        </div>
    );
}

export default OpenAccount;