import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { editEmployee, savedEmployee, updateDataEmployee } from '../service/EmployeeService'
import '../style/employeeform.css'

function EmployeeComponent() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (!id) return
        let isMounted = true
        setLoading(true)
        editEmployee(id)
            .then(({ data }) => {
                if (!isMounted) return
                setFirstName(data.firstName ?? '')
                setLastName(data.lastName ?? '')
                setEmail(data.email ?? '')
            })
            .catch((requestError) => {
                console.error(requestError)
                if (isMounted) setError('We could not load this employee. Return to the directory and try again.')
            })
            .finally(() => { if (isMounted) setLoading(false) })
        return () => { isMounted = false }
    }, [id])

    async function saveEmployee(event) {
        event.preventDefault()
        setError('')
        setSaving(true)
        const employee = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
        }
        try {
            if (id) await updateDataEmployee(id, employee)
            else await savedEmployee(employee)
            navigate('/')
        } catch (requestError) {
            console.error(requestError)
            setError(requestError.response?.status === 409
                ? 'That email address is already in use. Please enter another one.'
                : 'We could not save the employee. Check your connection and try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main className="form-page">
            <div className="form-breadcrumb"><Link to="/">Employees</Link><span>/</span><span>{id ? 'Edit employee' : 'Add employee'}</span></div>
            <div className="form-layout">
                <aside className="form-aside">
                    <p className="eyebrow">GROW YOUR TEAM DIRECTORY</p>
                    <h1>{id ? 'A little update goes a long way.' : 'Every great team starts with people.'}</h1>
                    <p>Add accurate contact details so your team information stays easy to find.</p>
                    <div className="aside-decoration" aria-hidden="true"><span>✳</span><i /><i /><i /></div>
                </aside>
                <section className="employee-form-card">
                    <div className="form-card-heading">
                        <span className="form-step">{id ? 'EMPLOYEE DETAILS' : 'NEW TEAM MEMBER'}</span>
                        <h2>{id ? 'Edit employee' : 'Add an employee'}</h2>
                        <p>Fields marked with <b>*</b> are required.</p>
                    </div>
                    {error && <div className="notice error-notice" role="alert">{error}</div>}
                    {loading ? <div className="form-loading"><span className="inline-spinner" /> Loading employee details…</div> : (
                        <form onSubmit={saveEmployee} className="employee-form">
                            <label className="field-label" htmlFor="firstName">First name <b>*</b></label>
                            <input id="firstName" name="firstName" autoComplete="given-name" placeholder="e.g. Jordan" value={firstName} onChange={(event) => setFirstName(event.target.value)} required maxLength="80" />

                            <label className="field-label" htmlFor="lastName">Last name <b>*</b></label>
                            <input id="lastName" name="lastName" autoComplete="family-name" placeholder="e.g. Lee" value={lastName} onChange={(event) => setLastName(event.target.value)} required maxLength="80" />

                            <label className="field-label" htmlFor="email">Work email <b>*</b></label>
                            <input id="email" name="email" type="email" autoComplete="email" placeholder="jordan@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength="150" />
                            <p className="field-hint">Use a valid email address for this employee.</p>

                            <div className="form-actions">
                                <button type="button" className="secondary-button" onClick={() => navigate('/')}>Cancel</button>
                                <button type="submit" className="primary-button" disabled={saving}>
                                    {saving ? 'Saving…' : id ? 'Save changes' : 'Add employee'}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </div>
        </main>
    )
}

export default EmployeeComponent
