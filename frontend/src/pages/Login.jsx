import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../context/stateContext";
import axios from "axios";

const Login = () => {
    const { setToken, token } = useStateContext()

    if (token) {
        return <Navigate to={'/'} />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/auth/login', {
                username: e.target.username.value,
                password: e.target.password.value,
            })
            sessionStorage.setItem('username', e.target.username.value) 
            setToken(response.data.token)
        } catch (error) {
            console.log(error.response);
        }
    }
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div class="container">
                    <a class="navbar-brand m-auto" href="index.html">Facegram</a>
                </div>
            </nav>

            <main class="mt-5">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-5">
                            <div class="card">
                                <div class="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                    <h5 class="mb-0">Login</h5>
                                </div>
                                <div class="card-body">
                                    <form method="post" onSubmit={handleSubmit}>
                                        <div class="mb-2">
                                            <label for="username">Username</label>
                                            <input type="text" class="form-control" id="username" name="username" />
                                        </div>

                                        <div class="mb-3">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" id="password" name="password" />
                                        </div>

                                        <button type="submit" class="btn btn-primary w-100">
                                            Login
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                Don't have account? <Link to={'/register'}>Register</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;