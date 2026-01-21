import React from 'react'

function Hero() {
    return (  
        <div className='container'>
            <div className='row text-center mt-5 p-5 border-bottom'>
                <h1>Zerodha Products</h1>
                <h3 className='text-muted mt-3 fs-4'>Sleek, modern, and intuitive trading platforms</h3>
                <p className='mt-3'>Check out our investment offerings <a href='' style={{textDecoration:'none'}}>Investments offerings<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a></p>
            </div>
        </div>
    );
}

export default Hero;