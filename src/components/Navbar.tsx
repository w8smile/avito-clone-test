import {Link} from "react-router-dom";

export const Navbar= () => {
    return(
        <nav>
            <ul>
                <li><Link to='/list'>Список</Link></li>
                <li><Link to='/form'>Разместить объявление</Link></li>
            </ul>
        </nav>
    )
}