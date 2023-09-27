
import React, { useState } from "react";
import { Link } from 'react-router-dom';

function SignIn(props) {

  const [showPassword, setShowPassword] = useState(false);
  const [passwordSignIn, setPasswordSignIn] = useState('');

  const handleSignInPasswordChange = (e) => {
    setPasswordSignIn(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <Link to="/signup">Sign Up</Link>
            </div><br />
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="floatingInput1" placeholder="name@example.com" />
              <label htmlFor="floatingInput1">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="floatingPassword1"
                placeholder="Password"
                value={passwordSignIn}
                onChange={handleSignInPasswordChange}
              />
              <label htmlFor="floatingPassword1">Password</label>
              <span
                className={`password-toggle ${showPassword ? 'show' : ''}`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                )}
              </span>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              <Link to="/forgotpassword">Forgot password?</Link>
            </p>
          </div>
        </form>
      </div>
    )
  }

  export default SignIn;