import React from 'react'
import { Link } from 'react-router-dom'

function RightSection() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/smallcaseLogo.png" />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/zerodhaFundhouse.png" style={{ width: "220px" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/sensibullLogo.svg" style={{ width: "220px" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/tijori.png" style={{ width: "220px" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/streakLogo.png" style={{ width: "220px" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="Media/Images/dittoLogo.png" style={{ width: "220px" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <Link to="/signup" style={{ width: "20%", margin: "0 auto" }}>
          <button
            className="p-2 btn btn-primary fs-5 mb-5"
            style={{ width: "100%" }}
          >
            Signup Now
          </button>
        </Link>
      </div>
    </div>
  )
}

export default RightSection;