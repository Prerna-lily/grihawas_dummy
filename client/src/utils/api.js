import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/send-email';

export const sendEmail = async (formData) => {
    try {
        await axios.post(API_URL, { ...formData })
    }
    catch (error) {
        console.error('Error submitting form', error);
        throw error
    }
};