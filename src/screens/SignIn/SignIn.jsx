import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../../helpers/TokenManager.js";
import api from "../../helpers/AxiosInstance.js";
import { toast } from "react-toastify";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [serverError, setServerError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        let isValid = true;

        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else {
            setEmailError(null);
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Password should be at least 8 characters");
            isValid = false;
        } else {
            setPasswordError(null);
        }

        if (isValid) {
            const data = {
                dtEmail: email,
                dtPassword: password,
            };

            try {
                const response = await api.post("/login/user", data);

                console.log(response)
                TokenManager.setAccessToken(response.data.dtAccessToken);
                TokenManager.setRefreshToken(response.data.dtRefreshToken);
                TokenManager.setUserRole(response.data.isAdmin)
                TokenManager.setUserId(response.data.id)

                toast.success("Login successful!");

                if (TokenManager.getUserRole() === 'true') {
                    navigate("/adminDashboard");
                } else {
                    navigate("/studentDashboard");
                }

            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(error.response.data.message || "Login failed.");
                } else if (error.message) {
                    setServerError(error.message);
                } else {
                    setServerError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="signInContainer">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src="/images/nhlLogo.png" alt="NHL Logo"/>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {emailError ?
                            <div>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <p id="email_error"
                                   className="mt-2 text-xs text-red dark:text-red">
                                    <span className="font-medium">Oh!</span>
                                    {emailError}
                                </p>
                            </div>
                            :
                            <div className="form-floating">
                                <input
                                    className="form-control rounded"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                        }

                        {passwordError ?
                            <div>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        name="password"
                                        type="password"
                                        placeholder="name@example.com"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-describedby="password_error"
                                    />

                                    <label htmlFor="floatingInput">Password</label>
                                </div>
                                <p id="password_error"
                                   className="mt-2 text-xs text-red dark:text-red">
                                    <span className="font-medium">Oh!</span>
                                    {passwordError}
                                </p>
                            </div>
                            :
                            <>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        name="password"
                                        type="password"
                                        placeholder="name@example.com"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-describedby="password_error"
                                    />

                                    <label htmlFor="floatingInput">Password</label>
                                </div>
                                {passwordError && <p className="text-red-600">Password is required</p>}
                            </>
                        }

                        <div>
                            <CustomButton type="submit" text="Login" isLoading={isLoading}/>
                        </div>
                    </form>

                    {serverError &&
                        <div
                            className="mt-5 flex items-center p-4 mb-4 text-sm text-red border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                            role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                                <span className="font-medium">Something went wrong!</span> {serverError}
                            </div>
                        </div>
                    }

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Not a member?{" "}
                        <a href="/signup" className="font-semibold text-primary hover:text-black">
                            Signup
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn
