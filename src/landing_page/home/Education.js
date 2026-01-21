import React from 'react'

function Education() {
    return (
        <div className='container p-3' style={{ marginTop: "1rem" }}>
            <div className='row align-items-center'>
                <div className='col-12 col-md-6 text-center mb-4 mb-md-0'>
                    <img src="Media/Images/education.svg" className='img-fluid' style={{ maxWidth: "70%" }} alt='Education' />
                </div>
                <div className='col-12 col-md-6'>
                    <h1 className="mb-3 fs-2">Free and open market education</h1>
                    <p>
                        Varsity, the largest online stock market education book in the world
                        covering everything from the basics to advanced trading.
                    </p>
                    <a href="" className='d-inline-block mb-3' style={{ textDecoration: "none" }}>
                        Versity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                    </a>
                    <p className="mt-4">
                        TradingQ&A, the most active trading and investment community in
                        India for all your market related queries.
                    </p>
                    <a href="" className='d-inline-block' style={{ textDecoration: "none" }}>
                        TradingQ&A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>

    );
}

export default Education;