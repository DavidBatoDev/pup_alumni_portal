// src/pages/SignUp/signup.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";

import AccountDetailsForm from '../../components/SignUpForms/AccountDetailsForm';
import PersonalInformationForm from '../../components/SignUpForms/PersonalInformationForm';
import EducationForm from '../../components/SignUpForms/EducationForm';
import "../../global.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from '../../assets/images/pup-login-banner.jpg';

const Signup = () => {
  // Manage state for the main registration form
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
    state: '',
    linkedin_profile: '',
  });

  // Step state to track the current form step
  const [currentStep, setCurrentStep] = useState(1);
  const formContainerRef = useRef(null);

  // Separate states for employment and education history
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkedinError, setLinkedinError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    scrollToFormContainer();
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const scrollToFormContainer = () => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({
        behavior: 'smooth', // Ensures smooth scrolling
        block: 'start', // Aligns to the top of the container
      });
    }
  };

  // Handle form changes for main form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle changes for employment history table
  const handleEmploymentChange = (index, key, value) => {
    const updatedEmployment = [...employmentHistory];
    updatedEmployment[index][key] = value;
    setEmploymentHistory(updatedEmployment);
  };

  // Handle changes for education history table
  const handleEducationChange = (index, key, value) => {
    const updatedEducation = [...educationHistory];
    updatedEducation[index][key] = value;
    setEducationHistory(updatedEducation);
  };

  // Add new entry to employment history
  const addNewEmployment = () => {
    setEmploymentHistory([...employmentHistory, { company: '', job_title: '', start_date: '', end_date: '', description: '' }]);
  };

  // Add new entry to education history
  const addNewEducation = () => {
    setEducationHistory([...educationHistory, { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '' }]);
  };

  const handleDeleteEmployment = (index) => {
    const updatedEmployment = employmentHistory.filter((_, i) => i !== index);
    setEmploymentHistory(updatedEmployment);
  };

  // Function to handle deletion of an education entry
  const handleDeleteEducation = (index) => {
    const updatedEducation = educationHistory.filter((_, i) => i !== index);
    setEducationHistory(updatedEducation);
  };

  // Handle LinkedIn profile input change and API request for fetching data
  const handleLinkedInChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'linkedin_profile' && value) {
      setLoading(true);
      setLinkedinError(null);

      try {
        // (DUMMY CODE BELOW) Implement fetch data using LinkedIn API
        const response = await axios.get('/api/linkedin-data', { params: { profileUrl: value } });
        if (response.data) {
          setEmploymentHistory(response.data.employmentHistory || []);
          setEducationHistory(response.data.educationHistory || []);
        }
      } catch (error) {
        console.error('Failed to fetch LinkedIn data:', error);
        setLinkedinError('Failed to fetch LinkedIn data');
      } finally {
        setLoading(false);
      }
    }
  };

  // const debugHandleSubmit = (e) => {
  //   e.preventDefault();
  //   setError(null);

  //   console.log(employmentHistory)
  //   console.log(educationHistory)
  // }

  // Handle main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submit

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Submit main registration form data
      const response = await axios.post('/api/register', formData);
      console.log('User Registered:', response.data);

      // Extract token
      const token = response.data.token;

      // Function to submit a single employment history entry
      const submitEmploymentHistory = async (history) => {
        await axios.post('/api/add-employment-history', history, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Employment History Entry Added');
      };

      // Function to submit a single education history entry
      const submitEducationHistory = async (history) => {
        await axios.post('/api/add-education-history', history, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Education History Entry Added');
      };

      // Submit employment history entries one by one
      for (const history of employmentHistory) {
        await submitEmploymentHistory(history);
      }

      // Submit education history entries one by one
      for (const history of educationHistory) {
        await submitEducationHistory(history);
      }

      console.log('All employment and education history entries added successfully.');
      navigate('/login');
    } catch (error) {
      console.log('Error during submission:', error.response);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="background login-background"></div>
        {/* Banner area */}
        <BannerSmall
          bannerTitle={"Register"}
          bannerImage={bannerImage}
        />

        {/* Signup Form */}
        <div className="sign-up-glass-container glass" ref={formContainerRef}>
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
                <div className="forms-container">
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
                      handleLinkedInChange={handleLinkedInChange}
                      handleEmploymentChange={handleEmploymentChange}
                      handleEducationChange={handleEducationChange}
                      addNewEmployment={addNewEmployment}
                      addNewEducation={addNewEducation}
                      employmentHistory={employmentHistory}
                      educationHistory={educationHistory}
                      handleDeleteEmployment={handleDeleteEmployment}
                      handleDeleteEducation={handleDeleteEducation}
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
