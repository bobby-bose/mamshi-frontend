import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import axios from 'axios';
import navigate from 'react-router-dom';
import HOST from '../../constants/constant';
import PORT from '../../constants/constant';
const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    

    const [mobileNumber, setMobileNumber] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        sessionStorage.setItem('mobileNumber', mobileNumber);
        navigate('/otp');

    };

    

    return (
        <>
            <MetaData title="Login | Slouch" />

           
            <main className="w-full mt-12 sm:pt-20 sm:mt-0">
                <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    <div className="loginSidebar bg-gray-700 p-10 pr-12 hidden sm:flex flex-col gap-4 w-2/5">
                        <h1 className="font-medium text-white text-3xl">Login</h1>
                        <p className="text-darkGray-200 text-lg">Get access to your Orders, Wishlist and Recommendations</p>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <div className="text-center py-10 px-4 sm:px-14">
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col w-full gap-4">
                                    <TextField
                                        fullWidth
                                        id="mobileNumber"
                                        label="Mobile Number"
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        required
                                    />
                                    <div className="flex flex-col gap-2.5 mt-2 mb-32">
                                        <p className="text-xs text-primary-grey text-left">By continuing, you agree to Slouch's <a href="https://www.google.com/pages/terms" className="text-primary-blue">Terms of Use</a> and <a href="https://www.google.com/pages/privacypolicy" className="text-primary-blue">Privacy Policy.</a></p>
                                        <button type="submit" className="text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium">Login</button>
                                    </div>
                                </div>
                            </form>
                              </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;