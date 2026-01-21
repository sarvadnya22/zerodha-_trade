import React from 'react'
import { Link } from 'react-router-dom'

function OpenAccount() {
    return (
        <div className='container p-5 mb-5'>
            <div className='row text-center'>
                <img className='mb-5' src='Media/Images/homeHero.png' alt='Hero Image' />
                <h1 className='mt-5'>Open a ZenoTrade account</h1>
                <p>Modern platform and apps, ₹0 and flat ₹20 Intraday and F&O trades</p>
                <Link to="/signup">
                    <button className=' mb-5 p-2 btn btn-primary fs-5' style={{ width: "18%" }}>Sign up Now</button>
                </Link>
            </div>
        </div>
    );
}

export default OpenAccount;