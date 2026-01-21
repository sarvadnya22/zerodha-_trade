import React from 'react'

function Pricing() {
    return (
        <div className='container mb-5 p-3'>
            <div className='row align-items-center'>
                <div className='col-12 col-lg-4 mb-4 mb-lg-0'>
                    <h1 className='mb-3'>Unbeatable Pricing</h1>
                    <p>We pioneered the concept of discount broking and price transparency
                        in India. Flat fees and no hidden charges.</p>
                    <a href='' className='d-inline-block' style={{ textDecoration: 'none' }}>see Pricing <i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                </div>
                <div className='col-lg-2 d-none d-lg-block'>
                </div>
                <div className='col-12 col-lg-6'>
                    <div className='row text-center g-0'>
                        <div className='col-6 p-3 border'>
                            <h1 className='mb-3 mb-md-4'>₹0</h1>
                            <p className='small'>Free equity delivery and direct mutual funds</p>
                        </div>
                        <div className='col-6 p-3 border'>
                            <h1 className='mb-3 mb-md-4'>₹20</h1>
                            <p className='small'>Intraday and F&O</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;