import axios from "axios";
import { useStateContext } from "../context/stateContext";
import { Link } from "react-router-dom";

const TopBar = () => {
    const { setToken } = useStateContext()
    const handleLogout = async () => {
        try {
            axios.delete('/auth/register')
            setToken(null)
            sessionStorage.removeItem('username')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div class="container">
                <Link to={'/'} class="navbar-brand">Facegram</Link>
                <div class="navbar-nav">
                    <a class="nav-link">{sessionStorage.getItem('username')}</a>
                    <button class="nav-link" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;