import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/users/reset-password/${token}`, { password });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;