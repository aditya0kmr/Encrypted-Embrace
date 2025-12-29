import { useState } from 'react'
import useUniverseStore from '../../stores/useUniverseStore'

export default function AuthOverlay() {
    const { login } = useUniverseStore()
    const [selectedRole, setSelectedRole] = useState(null) // 'aadi', 'nanniii', 'guest'
    const [loveCode, setLoveCode] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // State to track if the overlay is visible (triggered by 3D click in store)
    // For now, we'll simulate it or bind it later. 
    // Ideally, the store should have 'selectedCrystal' state.

    // Hardcoded Love Code for demo (should be hash in env)
    const EXPECTED_LOVE_CODE = "15062024"

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')

        if (selectedRole === 'guest') {
            login({ displayName: 'Guest Star' }, 'guest')
            return
        }

        // Admin Check
        if (loveCode === EXPECTED_LOVE_CODE) {
            if (password === 'admin123') { // Placeholder logic
                login({ displayName: selectedRole === 'aadi' ? 'Architect Aadi' : 'Investigator Nanniii' }, 'admin')
            } else {
                setError('Incorrect Personal Password')
            }
        } else {
            setError('The Stars Do Not Align (Wrong Love Code)')
        }
    }

    // We need a way to know WHICH crystal was clicked. 
    // For this step, I'll add a temporary selector to test.
    if (useUniverseStore.getState().isAuthenticated) return null

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '400px', padding: '2rem',
            background: 'rgba(20, 20, 40, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
            zIndex: 10
        }}>
            <h2 style={{ marginBottom: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1.2rem' }}>
                {selectedRole ? `${selectedRole.toUpperCase()} ACCESS` : 'IDENTIFY YOURSELF'}
            </h2>

            {!selectedRole ? (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => setSelectedRole('aadi')} style={btnStyle('blue')}>Aadi</button>
                    <button onClick={() => setSelectedRole('nanniii')} style={btnStyle('pink')}>Nanniii</button>
                    <button onClick={() => setSelectedRole('guest')} style={btnStyle('gray')}>Guest</button>
                </div>
            ) : (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {selectedRole !== 'guest' && (
                        <>
                            <div>
                                <label style={labelStyle}>Dual Crystal Resonance (Love Code)</label>
                                <input
                                    type="password"
                                    placeholder="DDMMYYYY"
                                    value={loveCode}
                                    onChange={(e) => setLoveCode(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Personal Key</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </>
                    )}

                    {selectedRole === 'guest' && <p>Enter the universe as a silent observer.</p>}

                    <button type="submit" style={actionBtnStyle}>
                        {selectedRole === 'guest' ? 'Enter Orbit' : 'Fuse Crystals'}
                    </button>

                    {error && <p style={{ color: '#ff4444', fontSize: '0.9rem' }}>{error}</p>}
                    <button type="button" onClick={() => setSelectedRole(null)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem' }}>
                        &larr; Back
                    </button>
                </form>
            )}
        </div>
    )
}

const btnStyle = (color) => ({
    flex: 1, padding: '1rem', borderRadius: '8px',
    background: color === 'blue' ? 'rgba(0,100,255,0.2)' : color === 'pink' ? 'rgba(255,100,180,0.2)' : 'rgba(255,255,255,0.1)',
    color: 'white', cursor: 'pointer', border: `1px solid ${color === 'blue' ? '#0066cc' : color === 'pink' ? '#ff66b2' : '#666'}`,
    transition: 'all 0.3s'
})

const inputStyle = {
    width: '100%', padding: '0.8rem', borderRadius: '6px',
    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
    color: 'white', fontSize: '1rem', outline: 'none'
}

const labelStyle = { display: 'block', textAlign: 'left', marginBottom: '0.3rem', fontSize: '0.8rem', color: '#aaa' }

const actionBtnStyle = {
    padding: '1rem', background: 'linear-gradient(45deg, #0066cc, #ff66b2)',
    border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold', cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: '1px'
}
