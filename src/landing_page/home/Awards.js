import React from 'react'

function Awards() {
    return (
        <div className='container mt-3 p-3 p-md-5'>
            <div className='row'>
                <div className='col-12 col-md-6 p-4 text-center'>
                    <img src='Media/Images/largestBroker.svg' className='img-fluid' alt='Largest Broker' />
                </div>
                <div className='col-12 col-md-6'>
                    <h1 className='mt-3 mt-md-5'>Largest stock broker in India</h1>
                    <p className='mb-4 mb-md-5 mt-3'>2+ million Zerodha clients contribute to over 15% of all retail
                        order volumes in India daily by trading and investing in: </p>

                    <div className='row mt-3 mt-md-5'>
                        <div className='col-12 col-md-6'>
                            <ul>
                                <li>
                                    <p>Futures and Options</p>
                                </li>
                                <li>
                                    <p>Commodity derivatives</p>
                                </li>
                                <li>
                                    <p>Currency derivatives</p>
                                </li>
                            </ul>
                        </div>
                        <div className='col-12 col-md-6'>
                            <ul>
                                <li>
                                    <p>Stocks & IPOs</p>
                                </li>
                                <li>
                                    <p>Direct mutual funds</p>
                                </li>
                                <li>
                                    <p>Bonds and Govt. Securities</p>
                                </li>
                            </ul>
                        </div>
                        <img src='Media/Images/pressLogos.png' className='img-fluid mt-3' style={{ maxWidth: "90%" }} alt='Press Logos' />
                    </div>


                </div>

            </div>

        </div>
    );
}

export default Awards;