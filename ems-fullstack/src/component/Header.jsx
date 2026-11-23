import { Link, NavLink } from 'react-router-dom'
import '../style/header.css'

function Header() {
    return (
        <header className="topbar">
            <div className="topbar-inner">
                <Link className="brand-lockup" to="/" aria-label="PeopleDesk home">
                    <span className="brand-mark">E</span>
                    <span className="brand-copy">
                        <strong>PeopleDesk</strong>
                        <small>TEAM DIRECTORY</small>
                    </span>
                </Link>
                <nav className="main-nav" aria-label="Main navigation">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Employees
                    </NavLink>
                    <Link to="/add-employee" className="nav-add-button">
                        <span aria-hidden="true">＋</span> Add employee
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
