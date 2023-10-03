
import React from "react";
import { Link } from 'react-router-dom';
import { auth } from "./firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ForgotPassword(props) {
    let navigate = useNavigate();
 
    const handleChangePassword = async (e) => {
        e.preventDefault();
        const emailValue = e.target.email.value;

        if (emailValue === null || emailValue === '') {
            Swal.fire({
                icon: 'error',
                title: `Please Enter Email To Change Password`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });
        } else {
            try {
                sendPasswordResetEmail(auth, emailValue).then(data => {
                    Swal.fire(
                        'Mail Sent',
                        'Follow the link send to your gmail to change password',
                        'success'
                      )
                    navigate(`/`);
                }).catch(err => {
                    alert(err.code)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={(e) => handleChangePassword(e)}>
                <div className="Auth-form-content">
                    <div className="Auth-form-header">
                        <Link to="/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                            </svg>
                        </Link>
                        <h3 className="Auth-form-title">Reset Password</h3><br />
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" name="email" className="form-control" id="floatingInput1" placeholder="name@example.com" />
                        <label htmlFor="floatingInput1">Email address</label>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Reset Password
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword;