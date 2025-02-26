require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const { google } = require('googleapis'); // Import googleapis

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
let storedOtp;
let storedPhoneNumber;

// Google Sheets API setup
const googleSheetId = process.env.GOOGLE_SHEET_ID; // Sheet ID
const serviceAccountKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS; // Path to the downloaded service account JSON key file
const googleSheetsAuth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    storedPhoneNumber = phone;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit OTP
        storedOtp = otp;

        await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: phone,
        });
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ message: 'Error sending OTP' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    console.log(otp, storedOtp)
    if (otp === storedOtp) {
        res.status(200).send({ message: 'OTP verified successfully' });
        storedOtp = null; // Reset after successful verification
        storedPhoneNumber = null;
    } else {
        res.status(400).send({ message: 'Invalid OTP' });
    }
});

const appendToGoogleSheetsData = async (data) => {
    try {
        const auth = await googleSheetsAuth.getClient();
        const sheets = google.sheets({ version: 'v4', auth });

        const values = [
            [
                data.firstName || '',
                data.lastName || '',
                data.fatherName || '',
                data.dob || '',
                data.gender || '',
                data.phone || '',
                data.email || '',
                data.address || '',
                data.state || '',
                data.city || '',
                data.pin || '',
                data.pan || '',
                data.aadhar || '',
                data.addSecondApplicant || '',
                data.secondFirstName || '',
                data.secondLastName || '',
                data.secondFatherName || '',
                data.secondDob || '',
                data.secondGender || '',
                data.secondPhone || '',
                data.secondEmail || '',
                data.secondAddress || '',
                data.secondState || '',
                data.secondCity || '',
                data.secondPin || '',
                data.secondPan || '',
                data.secondAadhar || '',
            ],
        ];

        const request = {
            spreadsheetId: googleSheetId,
            range: 'Sheet1!A1', // Replace with your sheet name and range
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: values,
            },
            auth: auth,
        };

        const response = (await sheets.spreadsheets.values.append(request)).data;
        console.log(JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
        throw error;
    }
};

app.post('/send-email', upload.single('paymentProof'), async (req, res) => {
    console.log(req.body); //Added console.log for debugging
    console.log(req.file);
    const {
        firstName,
        lastName,
        fatherName,
        dob,
        gender,
        phone,
        email,
        address,
        state,
        city,
        pin,
        pan,
        aadhar,
        asaCode,
        flatType,
        size,
        carpetArea,
        basicPrice,
        idc,
        eec,
        ffc,
        powerBackup,
        parking,
        totalCost, // Ensure this is present
        addSecondApplicant,
        secondFirstName,
        secondLastName,
        secondFatherName,
        secondDob,
        secondGender,
        secondPhone,
        secondEmail,
        secondAddress,
        secondState,
        secondCity,
        secondPin,
        secondPan,
        secondAadhar,
    } = req.body;

    const applicantType = addSecondApplicant ? 'First and Second' : 'First'; // Determine applicantType
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Application Form Details',
            html: `
            <h1>Application Form Details</h1>
            <h2>Applicant Details</h2>
            <p><strong>Applicant Type:</strong> ${applicantType}</p>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Father’s Name:</strong> ${fatherName}</p>
            <p><strong>D.O.B.:</strong> ${dob}</p>
            <p><strong>Gender:</strong> ${gender}</p>
             <p><strong>Ph. no.:</strong> ${phone}</p>
            <p><strong>Email ID:</strong> ${email}</p>
            <p><strong>Residential Address:</strong> ${address}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>PIN:</strong> ${pin}</p>
            <p><strong>Pan No.:</strong> ${pan}</p>
            <p><strong>Aadhar No.:</strong> ${aadhar}</p>

             ${addSecondApplicant ? `
             <h2>Second Applicant Details</h2>
            <p><strong>First Name:</strong> ${secondFirstName}</p>
            <p><strong>Last Name:</strong> ${secondLastName}</p>
            <p><strong>Father’s Name:</strong> ${secondFatherName}</p>
            <p><strong>D.O.B.:</strong> ${secondDob}</p>
            <p><strong>Gender:</strong> ${secondGender}</p>
             <p><strong>Ph. no.:</strong> ${secondPhone}</p>
            <p><strong>Email ID:</strong> ${secondEmail}</p>
            <p><strong>Residential Address:</strong> ${secondAddress}</p>
            <p><strong>State:</strong> ${secondState}</p>
            <p><strong>City:</strong> ${secondCity}</p>
            <p><strong>PIN:</strong> ${secondPin}</p>
            <p><strong>Pan No.:</strong> ${secondPan}</p>
            <p><strong>Aadhar No.:</strong> ${secondAadhar}</p>
            ` : ""}

            <h2>Flat Details</h2>
            <p><strong>ASA Code:</strong> ${asaCode}</p>
            <p><strong>Flat Type:</strong> ${flatType}</p>
            <p><strong>Size (MSSA):</strong> ${size}</p>
            <p><strong>Carpet Area:</strong> ${carpetArea}</p>
            <p><strong>Basic Sale Price:</strong> ${basicPrice}</p>
            <p><strong>Internal Development Charge (IDC):</strong> ${idc}</p>
            <p><strong>External Electrification Charge (EEC):</strong> ${eec}</p>
            <p><strong>Fire Fighting Charge (FFC):</strong> ${ffc}</p>
            <p><strong>Power Backup @Rs.20000 Per KVA:</strong> ${powerBackup}</p>
            <p><strong>Covered Car Parking:</strong> ${parking ? 'Yes' : 'No'}</p>
             <p><strong>Total Flat Cost:</strong> ${totalCost}</p>
            `,
            attachments: req.file ? [{
                filename: req.file.originalname,
                content: req.file.buffer,
                contentType: req.file.mimetype
            }] : undefined
        };

        // Append to Google Sheets
        const finalData = {
            ...req.body,
            applicantType: applicantType
        }
        await appendToGoogleSheetsData(finalData); // Pass the entire body

        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});