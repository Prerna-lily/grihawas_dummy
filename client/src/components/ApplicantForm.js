import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './ApplicantForm.css'; // Import your CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ApplicantForm = ({ onDataChange }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            addSecondApplicant: false,
        }
    });

    const addSecondApplicant = watch('addSecondApplicant');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (addSecondApplicant) {
            if (!otpSent) {
                try {
                    await sendOtp(data.secondPhone);
                    setOtpSent(true);
                } catch (error) {
                    console.error('Error sending OTP:', error);
                }
            } else {
                try {
                    await verifyOtp(otp);
                    onDataChange(data);
                    navigate('/registration/flat-details');
                } catch (error) {
                    console.error('Error verifying OTP:', error);
                }
            }
        } else {
            onDataChange(data);
            navigate('/registration/flat-details');
        }
    };

    const sendOtp = async (phone) => {
        try {
            await axios.post(`${API_URL}/send-otp`, { phone });
            alert('OTP sent to Second Applicant successfully!');
        } catch (error) {
            alert('Error sending OTP');
            console.error('Error sending OTP:', error);
            throw error;
        }
    };

    const verifyOtp = async (otp) => {
        try {
            await axios.post(`${API_URL}/verify-otp`, { otp });
            alert('OTP verified successfully!');
        } catch (error) {
            alert('Error verifying OTP');
            console.error('Error verifying OTP:', error);
            throw error;
        }
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const sharedInputProps = {
        type: 'text',
        className: 'input-field',
        required: true,
    };

    return (
        <form className="applicant-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>First Applicant Details</h2>
            <h3>Sole/First Applicant's Details:</h3>
            <div className="form-group">
                <label>First Name:</label>
                <input {...register('firstName', { required: true })} {...sharedInputProps} />
                {errors.firstName && <p className="error">First name is required</p>}
            </div>
            <div className="form-group">
                <label>Last Name:</label>
                <input {...register('lastName', { required: true })} {...sharedInputProps} />
                {errors.lastName && <p className="error">Last name is required</p>}
            </div>
            <div className="form-group">
                <label>Father’s Name:</label>
                <input {...register('fatherName', { required: true })} {...sharedInputProps} />
                {errors.fatherName && <p className="error">Father's name is required</p>}
            </div>
            <div className="form-group">
                <label>D.O.B.:</label>
                <input type="date" {...register('dob', { required: true })} className="input-field" required />
                {errors.dob && <p className="error">Date of birth is required</p>}
            </div>
            <div className="form-group">
                <label>Gender:</label>
                <select name="gender" {...register('gender', { required: true })} className="input-field" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && <p className="error">Gender is required</p>}
            </div>
            <div className="form-group">
                <label>Ph. no.:</label>
                <input
                    type="tel"
                    {...register('phone', {
                        required: true,
                        pattern: /^\+91[0-9]{10}$/,
                    })}
                    className="input-field"
                    required
                    placeholder="+91"
                />
                {errors.phone && (
                    <p className="error">
                        Phone number is required and must start with +91 followed by 10 digits
                    </p>
                )}
            </div>
            <div className="form-group">
                <label>Email ID:</label>
                <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className="input-field" required />
                {errors.email && <p className="error">Valid email is required</p>}
            </div>
            <div className="form-group">
                <label>Residential Address:</label>
                <input {...register('address', { required: true })} {...sharedInputProps} />
                {errors.address && <p className="error">Address is required</p>}
            </div>
            <div className="form-group">
                <label>State:</label>
                <input {...register('state', { required: true })} {...sharedInputProps} />
                {errors.state && <p className="error">State is required</p>}
            </div>
            <div className="form-group">
                <label>City:</label>
                <input {...register('city', { required: true })} {...sharedInputProps} />
                {errors.city && <p className="error">City is required</p>}
            </div>
            <div className="form-group">
                <label>PIN:</label>
                <input type="text" {...register('pin', { required: true, pattern: /^[0-9]{6}$/ })} className="input-field" required />
                {errors.pin && <p className="error">PIN is required and must be 6 digits</p>}
            </div>
            <div className="form-group">
                <label>Pan No.:</label>
                <input {...register('pan', { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ })} {...sharedInputProps} />
                {errors.pan && <p className="error">Valid pan number is required</p>}
            </div>
            <div className="form-group">
                <label>Aadhar No.:</label>
                <input type="text" {...register('aadhar', { required: true, pattern: /^[0-9]{12}$/ })} className="input-field" required />
                {errors.aadhar && <p className="error">Valid aadhar is required and must be 12 digits</p>}
            </div>
              {/* Hidden input to specify applicant type */}
            <input type="hidden" {...register('applicantType')} value={addSecondApplicant ? 'First and Second' : 'First'} />
            <div className="form-group">
                <label>
                    <input type="checkbox" {...register('addSecondApplicant')} />
                    Add Second Applicant Details?
                </label>
            </div>
            {addSecondApplicant && (
                <>
                    <h2>Second Applicant Details</h2>
                    <h3>Joint/Second Applicant’s Details:</h3>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input {...register('secondFirstName', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondFirstName && <p className="error">First name is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input {...register('secondLastName', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondLastName && <p className="error">Last name is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Father’s Name:</label>
                        <input {...register('secondFatherName', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondFatherName && <p className="error">Father's name is required</p>}
                    </div>
                    <div className="form-group">
                        <label>D.O.B.:</label>
                        <input type="date" {...register('secondDob', { required: addSecondApplicant })} className="input-field" />
                        {errors.secondDob && <p className="error">Date of birth is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <select name="secondGender" {...register('secondGender', { required: addSecondApplicant })} className="input-field">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.secondGender && <p className="error">Gender is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Ph. no.:</label>
                        <input
                            type="tel"
                            {...register('secondPhone', {
                                required: addSecondApplicant,
                                pattern: /^\+91[0-9]{10}$/,
                            })}
                            className="input-field"
                            placeholder="+91"
                        />
                        {errors.secondPhone && (
                            <p className="error">
                                Phone number is required and must start with +91 followed by 10 digits
                            </p>
                        )}
                    </div>
                    {otpSent && (
                        <div className="form-group">
                            <label>Enter OTP:</label>
                            <input type="text" onChange={handleOtpChange} className="input-field" required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email ID:</label>
                        <input type="email" {...register('secondEmail', { required: addSecondApplicant, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className="input-field" />
                        {errors.secondEmail && <p className="error">Valid email is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Residential Address:</label>
                        <input {...register('secondAddress', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondAddress && <p className="error">Address is required</p>}
                    </div>
                    <div className="form-group">
                        <label>State:</label>
                        <input {...register('secondState', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondState && <p className="error">State is required</p>}
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input {...register('secondCity', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondCity && <p className="error">City is required</p>}
                    </div>
                    <div className="form-group">
                        <label>PIN:</label>
                        <input type="text" {...register('secondPin', { required: addSecondApplicant, pattern: /^[0-9]{6}$/ })} className="input-field" />
                        {errors.secondPin && <p className="error">PIN is required and must be 6 digits</p>}
                    </div>
                    <div className="form-group">
                        <label>Pan No.:</label>
                        <input {...register('secondPan', { required: addSecondApplicant })} {...sharedInputProps} />
                        {errors.secondPan && <p className="error">Valid pan number is required</p>}
                    </div>
                    <div className="form-group">
                        <label>Aadhar No.:</label>
                        <input type="text" {...register('aadhar', { required: addSecondApplicant })} className="input-field" />
                        {errors.secondAadhar && <p className="error">Valid aadhar is required</p>}
                    </div>
                </>
            )}
            <button type="submit" className="next-button">
                {addSecondApplicant ? (otpSent ? 'Verify OTP & Next' : 'Send OTP') : 'Next'}
            </button>
        </form>
    );
};

export default ApplicantForm;