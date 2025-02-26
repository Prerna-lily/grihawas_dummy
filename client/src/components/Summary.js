import React from 'react';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

const Summary = ({ formData, onSubmit }) => {
    const navigate = useNavigate();

    const renderApplicantDetails = () => {
        const { applicantType, firstName, lastName, fatherName, dob, gender, phone, email, address, state, city, pin, pan, aadhar, secondFirstName, secondLastName, secondFatherName, secondDob, secondGender, secondPhone, secondEmail, secondAddress, secondState, secondCity, secondPin, secondPan, secondAadhar } = formData;
        return (
            <div className="summary-section">
                <h3>{formData.addSecondApplicant ? "First Applicant Details:" : "Sole Applicant's Details:"}</h3>
                <p><strong>First Name:</strong> {firstName}</p>
                <p><strong>Last Name:</strong> {lastName}</p>
                <p><strong>Father’s Name:</strong> {fatherName}</p>
                <p><strong>D.O.B.:</strong> {dob}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>Ph. no.:</strong> {phone}</p>
                <p><strong>Email ID:</strong> {email}</p>
                <p><strong>Residential Address:</strong> {address}</p>
                <p><strong>State:</strong> {state}</p>
                <p><strong>City:</strong> {city}</p>
                <p><strong>PIN:</strong> {pin}</p>
                <p><strong>Pan No.:</strong> {pan}</p>
                <p><strong>Aadhar No.:</strong> {aadhar}</p>
                {formData.addSecondApplicant && (
                    <>
                        <h3>Second Applicant Details:</h3>
                        <p><strong>First Name:</strong> {secondFirstName}</p>
                        <p><strong>Last Name:</strong> {secondLastName}</p>
                        <p><strong>Father’s Name:</strong> {secondFatherName}</p>
                        <p><strong>D.O.B.:</strong> {secondDob}</p>
                        <p><strong>Gender:</strong> {secondGender}</p>
                        <p><strong>Ph. no.:</strong> {secondPhone}</p>
                        <p><strong>Email ID:</strong> {secondEmail}</p>
                        <p><strong>Residential Address:</strong> {secondAddress}</p>
                        <p><strong>State:</strong> {secondState}</p>
                        <p><strong>City:</strong> {secondCity}</p>
                        <p><strong>PIN:</strong> {secondPin}</p>
                        <p><strong>Pan No.:</strong> {secondPan}</p>
                        <p><strong>Aadhar No.:</strong> {secondAadhar}</p>
                    </>
                )}
            </div>
        );
    };

    const renderFlatDetails = () => {
        const { asaCode, flatType, size, carpetArea, basicPrice, idc, eec, ffc, powerBackup, parking, totalCost } = formData;
        return (
            <div className="summary-section">
                <h3>Flat Details:</h3>
                <p><strong>ASA Code:</strong> {asaCode}</p>
                <p><strong>Flat Type:</strong> {flatType}</p>
                <p><strong>Size (MSSA):</strong> {size}</p>
                <p><strong>Carpet Area:</strong> {carpetArea}</p>
                <p><strong>Basic Sale Price:</strong> {basicPrice}</p>
                <p><strong>Internal Development Charge (IDC):</strong> {idc}</p>
                <p><strong>External Electrification Charge (EEC):</strong> {eec}</p>
                <p><strong>Fire Fighting Charge (FFC):</strong> {ffc}</p>
                <p><strong>Power Backup @Rs.20000 Per KVA:</strong> {powerBackup}</p>
                <p><strong>Covered Car Parking:</strong> {parking ? "Yes" : "No"}</p>
                <p><strong>Total Flat Cost:</strong> {totalCost}</p>
            </div>
        );
    };

    const handleBack = () => {
        navigate('/registration/flat-details');
    };

    const handleSubmit = async () => {
        try {
            await onSubmit(); // Call the onSubmit function passed from App.js
            alert('Form submitted and email sent successfully!');
            navigate('/'); // Redirect to the home page after successful submission
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form and sending email.');
        }
    };

    return (
        <div className="form-container">
            <h2>Summary</h2>
            {renderApplicantDetails()}
            {renderFlatDetails()}
            <div className='form-group'>
                <button onClick={handleBack} className="back-button">Back</button>
                <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>
        </div>
    );
};

export default Summary;