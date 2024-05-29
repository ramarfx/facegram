import axios from "axios";
import { useStateContext } from "../context/stateContext";

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
                <a class="navbar-brand" href="homepage.html">Facegram</a>
                <div class="navbar-nav">
                    <a class="nav-link" href="my-profile.html">{sessionStorage.getItem('username')}</a>
                    <button class="nav-link" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;