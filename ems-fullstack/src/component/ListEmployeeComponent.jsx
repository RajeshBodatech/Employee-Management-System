import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteEmployee, listEmployees } from '../service/EmployeeService.js'

function initials(employee) {
    return `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase()
}

function ListEmployeeComponent() {
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const getAllEmployees = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const response = await listEmployees()
            setEmployees(response.data)
        } catch (requestError) {
            console.error(requestError)
            setError('We could not load the employee list. Check that the backend and database are running, then try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getAllEmployees()
    }, [getAllEmployees])

    const filteredEmployees = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        if (!normalizedQuery) return employees
        return employees.filter((employee) =>
            [employee.firstName, employee.lastName, employee.email, String(employee.id)]
                .some((value) => value?.toLowerCase().includes(normalizedQuery)),
        )
    }, [employees, query])

    async function removeEmployee(employee) {
        const fullName = `${employee.firstName} ${employee.lastName}`.trim()
        if (!window.confirm(`Remove ${fullName} from the employee directory?`)) return
        try {
            await deleteEmployee(employee.id)
            setEmployees((current) => current.filter((item) => item.id !== employee.id))
        } catch (requestError) {
            console.error(requestError)
            setError('That employee could not be removed. Please try again.')
        }
    }

    return (
        <main className="page-content">
            <section className="welcome-row">
                <div>
                    <p className="eyebrow">YOUR PEOPLE, AT A GLANCE</p>
                    <h1>Employee directory</h1>
                    <p className="page-description">Keep your team information organized and up to date.</p>
                </div>
                <button className="primary-button welcome-add" onClick={() => navigate('/add-employee')}>
                    <span aria-hidden="true">＋</span> Add employee
                </button>
            </section>

            <section className="summary-grid" aria-label="Directory summary">
                <article className="summary-card">
                    <span className="summary-icon people-icon" aria-hidden="true">♙</span>
                    <div><p>Total employees</p><strong>{loading ? '—' : employees.length}</strong></div>
                    <span className="summary-note">In your directory</span>
                </article>
                <article className="summary-card summary-card-accent">
                    <span className="summary-icon search-icon" aria-hidden="true">⌕</span>
                    <div><p>Search results</p><strong>{loading ? '—' : filteredEmployees.length}</strong></div>
                    <span className="summary-note">Matching your search</span>
                </article>
            </section>

            <section className="directory-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Team members</h2>
                        <p>Names and contact information for your team</p>
                    </div>
                    <label className="search-box">
                        <span className="search-symbol" aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search name, email, or ID"
                            aria-label="Search employees by name, email, or ID"
                        />
                        {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
                    </label>
                </div>

                {error && <div className="notice error-notice" role="alert">{error}<button onClick={getAllEmployees}>Try again</button></div>}

                <div className="table-wrap">
                    <table className="employee-table">
                        <thead>
                            <tr><th>EMPLOYEE</th><th>EMAIL ADDRESS</th><th>EMPLOYEE ID</th><th className="actions-heading">ACTIONS</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="table-message"><span className="inline-spinner" /> Loading your team…</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="table-message empty-state">
                                        <span className="empty-icon" aria-hidden="true">♙</span>
                                        <strong>{query ? 'No matches found' : 'Your directory is ready'}</strong>
                                        <span>{query ? 'Try a different name, email, or ID.' : 'Add your first employee to get started.'}</span>
                                        {!query && <button className="primary-button" onClick={() => navigate('/add-employee')}>Add your first employee</button>}
                                    </td>
                                </tr>
                            ) : filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className="employee-identity">
                                            <span className="avatar">{initials(employee)}</span>
                                            <span><strong>{employee.firstName} {employee.lastName}</strong><small>Team member</small></span>
                                        </div>
                                    </td>
                                    <td><a className="email-link" href={`mailto:${employee.email}`}>{employee.email}</a></td>
                                    <td><span className="id-pill">EMP-{String(employee.id).padStart(3, '0')}</span></td>
                                    <td className="row-actions">
                                        <button className="table-action edit-action" onClick={() => navigate(`/update-employee/${employee.id}`)} aria-label={`Edit ${employee.firstName} ${employee.lastName}`}>Edit</button>
                                        <button className="table-action delete-action" onClick={() => removeEmployee(employee)} aria-label={`Delete ${employee.firstName} ${employee.lastName}`}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && employees.length > 0 && (
                    <div className="table-footer">Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> {employees.length === 1 ? 'employee' : 'employees'}{query && <Link to="/" onClick={() => setQuery('')}>Clear search</Link>}</div>
                )}
            </section>
        </main>
    )
}

export default ListEmployeeComponent
