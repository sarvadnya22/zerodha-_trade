import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className='container p-3 p-md-5 mb-5'>
            <div className='row text-center'>
                <img className='mb-4 mb-md-5 img-fluid' src='Media/Images/homeHero.png' alt='Hero Image' />
                <h1 className='mt-3 mt-md-5'>Invest in everything</h1>
                <p className='px-3'>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
                <div className='mt-3'>
                    <Link to="/signup">
                        <button className='mb-4 mb-md-5 p-2 px-4 btn btn-primary fs-5'>Signup Now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Hero;