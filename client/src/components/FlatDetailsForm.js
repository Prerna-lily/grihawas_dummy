//FlatDetailsForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { calculateFlatCost } from '../utils/calculations';
import '../styles.css';
import './FlatDetailsForm.css';
import { useNavigate } from 'react-router-dom';

const FlatDetailsForm = ({ onDataChange, prevData }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            asaCode: "",
            flatType: "",
            parking: false
        }
    });
    const asaCode = watch('asaCode');
    const flatType = watch('flatType');
    const parking = watch('parking');
    const [flatData, setFlatData] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);

    useEffect(() => {
        if (asaCode && flatType) {
            const calculatedData = calculateFlatCost(flatType);
            setFlatData(calculatedData);
            setValue('size', calculatedData.size)
            setValue('carpetArea', calculatedData.carpetArea)
            setValue('basicPrice', calculatedData.basicPrice)
            setValue('idc', calculatedData.idc)
            setValue('eec', calculatedData.eec)
            setValue('ffc', calculatedData.ffc)
            setValue('powerBackup', calculatedData.powerBackup)
        }
    }, [asaCode, flatType, setValue]);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPaymentProof(file);

    }
    const onSubmit = (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        formData.append('paymentProof', paymentProof)
         if (flatData) {
                Object.keys(flatData).forEach(key => {
                 formData.append(key, flatData[key])
                })
            }
            formData.append('totalCost', totalCost)
        onDataChange(formData);
        navigate('/registration/summary');

    };

    const totalCost = flatData ? flatData.basicPrice + flatData.eec + flatData.idc + flatData.ffc + flatData.powerBackup + (parking ? 200000 : 0) : 0;
    const sharedInputProps = {
        type: 'text',
        className: 'input-field',
        disabled: true
    };

    const handleBack = () => {
        navigate('/registration/applicant')
    };

    return (
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <h2>Flat Details</h2>
            <div className="form-group">
                <label>ASA Code:</label>
                <select name="asaCode" {...register('asaCode', { required: true })} className="input-field" required>
                    <option value="">Select ASA Code</option>
                    <option value="TV">TV</option>
                    <option value="PU">PU</option>
                    <option value="AR">AR</option>
                    <option value="MI">MI</option>
                    <option value="I2R">I2R</option>
                    <option value="NA">NA</option>
                </select>
                {errors.asaCode && <p className="error">ASA Code is required</p>}
            </div>
            <div className="form-group">
                <label>Flat Type:</label>
                <select name="flatType" {...register('flatType', { required: true })} className="input-field" required>
                    <option value="">Select Flat Type</option>
                    <option value="T1">T1(NEW)</option>
                    <option value="T5">T5</option>
                </select>
                {errors.flatType && <p className="error">Flat Type is required</p>}
            </div>
            <div className="form-group">
                <label>Size (MSSA):</label>
                <input {...register('size')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Carpet Area:</label>
                <input {...register('carpetArea')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Basic Sale Price:</label>
                <input {...register('basicPrice')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Internal Development Charge (IDC):</label>
                <input {...register('idc')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>External Electrification Charge (EEC):</label>
                <input {...register('eec')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Fire Fighting Charge (FFC):</label>
                <input {...register('ffc')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Power Backup @Rs.20000 Per KVA:</label>
                <input {...register('powerBackup')} {...sharedInputProps} />
            </div>
            <div className="form-group">
                <label>Covered Car Parking:</label>
                <select name="parking" {...register('parking')} className="input-field" required>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>

                </select>
            </div>
            <div className="form-group">
                <label>Total Flat Cost:</label>
                <input type="text" value={totalCost} disabled className="input-field" />
            </div>
            <div className="form-group">
                <label>Attach Payment Proof (10MB):</label>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="input-field"/>
            </div>
            <div className='form-group'>
             <button onClick={handleBack} className="back-button">Back</button>
            <button type="submit" className="next-button">Next</button>
            </div>
        </form>
    );
};

export default FlatDetailsForm;