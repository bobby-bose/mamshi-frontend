import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import client from '../../api/client';
import CounterBanner from '../Home/Banner/top';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    // Change state variable from mobileNumber to email
    const [email, setEmail] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log("Sending OTP to email:", email);
            // Make an API call to your backend with the email
            const response = await client.post('send-otp-email', { email });
                   if (response.data.success) {
                    sessionStorage.setItem("mobileNumber", email);
              
                // Navigate to the OTP verification page
                navigate('/otp');
                enqueueSnackbar("OTP sent to your email.", { variant: "success" });
            } else {
                enqueueSnackbar(response.data.message || "Failed to send OTP.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
            console.error(error);
        }
    };

    return (
        <>
            <MetaData title="Login | Slouch" />
            <CounterBanner  />
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
                                        id="email"
                                        label="Email Address" // Change label to "Email Address"
                                        type="email" // Change type to "email" for proper validation
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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