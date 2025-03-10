import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../helpers/AxiosInstance.js";
import {toast} from "react-toastify";

function SignUp () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [studentYear, setStudentYear] = useState("");

    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [repeatPasswordError, setRepeatPasswordError] = useState(null);
    const [studentNumberError, setStudentNumberError] = useState(null);
    const [studentYearError, setStudentYearError] = useState(null);
    const [serverError, setServerError] = useState('')

    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        let isValid = true;

        if (!name) {
            setNameError('Name is reuqired');
            isValid = false;
        } else {
            setNameError(null);
        }

        if (!email) {
            setEmailError('Email is reuqired');
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

        if (!repeatPassword) {
            setRepeatPasswordError("Password repeat is required");
            isValid = false;
        } else if (repeatPassword !== password) {
            setRepeatPasswordError("Passwords do not match");
            isValid = false;
        } else {
            setRepeatPasswordError(null);
        }

        if (!studentNumber) {
            setStudentNumberError("Student number is required");
            isValid = false;
        } else if (studentNumber.length !== 7) {
            setStudentNumberError("Student number must be 7 characters");
            isValid = false;
        } else {
            setStudentNumberError(null);
        }

        const studentYears = ["1", "2", "3", "4"];
        if (!studentYear || studentYear === "0") {
            setStudentYearError("Student year is required");
            isValid = false;
        } else if (!studentYears.includes(studentYear)) {
            setStudentYearError("Invalid student year");
            isValid = false;
        } else {
            setStudentYearError(null);
        }

        if (isValid) {

            const data = {
                "dtStudentNumber": studentNumber,
                "dtEmail": email,
                "dtPassword": password,
                "dtFullName": name,
                "dtStudentYear": studentYear,
            };

            try {
                const response = await api.post('/student/register', data);
                console.log(response)

                toast.success("You successfully registered, please login!");
                navigate('/');

            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(error.response.data.message || "Signup failed.");
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
        <div className="signUpContainer">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src="/images/nhlLogo.png" alt="NHL Logo" />
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {nameError !== null ?
                            <div>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        aria-describedby="name_error"
                                    />

                                    <label htmlFor="floatingInput">Full name</label>
                                </div>

                                <p id="name_error"
                                   className="mt-2 text-xs text-red dark:text-red">
                                    <span className="font-medium">Oh!</span>
                                    {nameError}
                                </p>
                            </div>
                            :
                            <div className="form-floating">
                                <input
                                    className="form-control rounded"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <label htmlFor="floatingInput">Full name</label>
                            </div>

                        }

                        {emailError !== null ?
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
                                        aria-describedby="email_error"
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

                        {passwordError !== null ?
                            <div>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        name="password"
                                        type="password"
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
                            <div className="form-floating">
                                <input
                                    className="form-control rounded"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <label htmlFor="floatingInput">Password</label>
                            </div>

                        }

                        {repeatPasswordError !== null ?
                            <div>
                                <div className="form-floating">
                                    <input
                                        className="form-control rounded"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        name="repeatPassword"
                                        type="password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        aria-describedby="repeatPassword_error"
                                    />

                                    <label htmlFor="floatingInput">Repeat password</label>
                                </div>

                                <p id="repeatPassword_error"
                                   className="mt-2 text-xs text-red dark:text-red">
                                    <span className="font-medium">Oh!</span>
                                    {repeatPasswordError}
                                </p>
                            </div>
                            :
                            <div className="form-floating">
                                <input
                                    className="form-control rounded"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    name="repeatPassword"
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />

                                <label htmlFor="floatingInput">Repeat password</label>
                            </div>

                        }

                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                {studentYearError !== null ?
                                    <div>
                                        < select id="studentYear"
                                                 value={studentYear}
                                                 onChange={(e) => setStudentYear(e.target.value)}
                                                 aria-describedby="studentYear_error"
                                                 className="p-3 bg-gray-50 border border-gray-300 dark:border-red text-sm rounded-lg border-red dark:focus:border-red focus:outline-none block w-full focus:ring-0 focus:border-red peer dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="0" selected className={"text-red dark:text-red"}>Choose a year</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                        <p id="studentYear_error"
                                           className="mt-2 text-xs text-red dark:text-red">
                                            <span className="font-medium">Oh!</span>
                                            {studentYearError}
                                        </p>
                                    </div>
                                    :
                                    <select id="studentYear"
                                            value={studentYear}
                                            onChange={(e) => setStudentYear(e.target.value)}
                                            className="p-3 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="0" selected>Choose a year</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                }

                            </div>

                            <div>
                                {studentNumberError !== null ?
                                    <div>
                                        <div className="form-floating">
                                            <input
                                                className="form-control rounded"
                                                id="floatingInput"
                                                placeholder="name@example.com"
                                                name="studentNumber"
                                                type="number"
                                                value={studentNumber}
                                                onChange={(e) => setStudentNumber(e.target.value)}
                                            />

                                            <label htmlFor="floatingInput">Student number</label>
                                        </div>

                                        <p id="studentNumber_error"
                                           className="mt-2 text-xs text-red dark:text-red">
                                            <span className="font-medium">Oh!</span>
                                            {studentNumberError}
                                        </p>
                                    </div>
                                    :
                                    <div className="form-floating">
                                        <input
                                            className="form-control rounded"
                                            id="floatingInput"
                                            placeholder="name@example.com"
                                            name="studentNumber"
                                            type="number"
                                            value={studentNumber}
                                            onChange={(e) => setStudentNumber(e.target.value)}
                                        />

                                        <label htmlFor="floatingInput">Student Number</label>
                                    </div>
                                }
                            </div>

                        </div>

                        <div>
                            <CustomButton type="submit" text="Signup" isLoading={isLoading}/>
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
                        Already have an account?{" "}
                        <a href="/" className="font-semibold text-primary hover:text-black">
                            Signin
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp
