import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { auth } from "../../firebase";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, AuthErrorCodes } from "firebase/auth";

function SignUp(props) {

    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    let navigate = useNavigate();

    const signUp = (e) => {
        e.preventDefault();
        if (name === null || name === '') {
            Swal.fire({
                icon: 'error',
                title: `Please Enter Name`,
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
        } else if (email === null || email === '') {
            Swal.fire({
                icon: 'error',
                title: `Please Enter Email`,
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
        } else if (password === null || password === '') {
            Swal.fire({
                icon: 'error',
                title: `Please Enter Password`,
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
        } else if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: `Password Should Be Atleast 6 Characters`,
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
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (res) => {
                    const user = res.user;
                    await updateProfile(user, {
                        displayName: name,
                    })
                }).then((userCredential) => {
                    navigate(`/`);
                    console.log(userCredential);
                    setName('');
                    setEmail('');
                    setPassword('');
                    Swal.fire({
                        icon: 'success',
                        title: `Signed Up Successfully`,
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
                })
                .catch((error) => {
                    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
                        Swal.fire({
                            icon: 'error',
                            title: `Email Already Exists`,
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
                        console.log(error);
                        Swal.fire({
                            icon: 'error',
                            title: `Error Signing Up, Try Again`,
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
                    }
                });
        }
    };


    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={signUp}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <Link to="/">Sign In</Link>
                    </div><br />
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="John Doe" value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="floatingInput">Full Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingInput2" placeholder="john@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="floatingInput2">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="floatingPassword2"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword2">Password</label>
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
        </div >
    )
}

export default SignUp;