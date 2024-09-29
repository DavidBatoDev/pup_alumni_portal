// src/pages/SignUp/signup.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";

import AccountDetailsForm from '../../components/Forms/AccountDetailsForm';
import PersonalInformationForm from '../../components/Forms/PersonalInformationForm';
import EducationForm from '../../components/Forms/EducationForm';

import "../../global.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();
    // Manage form state
    const [formData, setFormData] = useState({
        student_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        gender: '',
        birthday: '',
        street: '',
        city: '',
        postal_code: '',
        country: '',
        graduation_year: '',
        degree: '',
        field_of_study: '',
        current_job_title: '',
        current_employer: '',
        linkedin_profile: '',
        state: '',
    });

    const [error, setError] = useState(null);

    // Step state to track the current form step
    const [currentStep, setCurrentStep] = useState(1);

    // Function to go to the next step
    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    // Function to go to the previous step
    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error before submit
        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match");
            return;
        }


        // Filter out empty fields from formData
        const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== "")
        );

        const body = {
            ...filteredFormData,
            graduation_year: parseInt(filteredFormData.graduation_year),
        }

        console.log(body);

        try {
            const response = await axios.post('/api/register', body);
            console.log(response.data);
            navigate('/login');

        } catch (error) {
            console.log(error.response);
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="signup-page">
                <div className="background login-background"></div>
                {/* Banner area */}
                <div className="banner-section">
                    <h1 className="signup-title">Register</h1>
                </div>

                {/* Signup Form */}
                <div className="glass-container glass">
                    {/* Header Section */}
                    <div className="row justify-content-center">
                        <div className="signup-header">
                            <h1 className="signup-header">Join Our Alumni Network Today!</h1>
                            <p className="signup-description">
                                Become a part of our thriving alumni community. Register now to stay updated with the latest news,
                                participate in events, access job listings, and connect with mentors.
                            </p>
                        </div>
                    </div>

                    {/* Signup Form Section */}
                    <div className="row justify-content-center mt-5">
                        <form onSubmit={handleSubmit} className="w-100">
                            {/* Form Container */}
                            <div className="container d-flex justify-content-center">
                                {/* Form Content based on Current Step */}
                                <div className="row align-items-center w-auto">
                                    {currentStep === 1 && (
                                        <AccountDetailsForm
                                            nextStep={nextStep}
                                            prevStep={prevStep}
                                            formData={formData}
                                            handleChange={handleChange}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <PersonalInformationForm
                                            nextStep={nextStep}
                                            prevStep={prevStep}
                                            formData={formData}
                                            handleChange={handleChange}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <EducationForm
                                            nextStep={nextStep}
                                            prevStep={prevStep}
                                            formData={formData}
                                            handleChange={handleChange}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Error Message Display */}
                            {error && <p className="error-message text-center">{error}</p>}
                        </form>
                    </div>
                </div>

            </div>

            <MainFooter />
        </>
    );
};

export default Signup;
