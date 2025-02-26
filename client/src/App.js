import React, { useState, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import ApplicantForm from './components/ApplicantForm';
import FlatDetailsForm from './components/FlatDetailsForm';
import Summary from './components/Summary';
import HomePage from './components/HomePage';
import { sendEmail } from './utils/api';
import './styles.css';

function App() {
    const [formData, setFormData] = useState({});

    const handleDataChange = useCallback((data) => {
        setFormData(prevFormData => {
            const newData = data instanceof FormData ? Object.fromEntries(data) : data;
            return { ...prevFormData, ...newData };
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            await sendEmail(formData);
            alert('Form submitted and email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error submitting form and sending email.');
        }
    }, [formData]);

    return (
        <div className="app-container">
            {/* Define Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/registration/applicant" element={<ApplicantForm onDataChange={handleDataChange} />} />
                <Route path="/registration/flat-details" element={<FlatDetailsForm onDataChange={handleDataChange} prevData={formData} />} />
                <Route path="/registration/summary" element={<Summary formData={formData} onSubmit={handleSubmit} />} />
            </Routes>
        </div>
    );
}

export default App;