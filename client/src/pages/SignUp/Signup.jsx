// src/pages/SignUp/signup.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";

import AccountDetailsForm from '../../components/SignUpForms/AccountDetailsForm';
import PersonalInformationForm from '../../components/SignUpForms/PersonalInformationForm';
import EducationForm from '../../components/SignUpForms/EducationForm';
import "../../global.css";
// import axios from "axios";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import CustomAlert from '../../components/CustomAlert/CustomAlert';

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
    graduation_year: '',
    degree: '',
    major: '',
    current_job_title: '',
    current_employer: '',
  });



  const educationFormRef = useRef(); // Create a ref for the EducationForm

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

    return () => {
      // Cleanup function
      setLoading(false);
    }
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

  const processLinkedInData = (data) => {
    const formattedEmploymentHistory = data.position.map((job) => ({
      company: job.companyName || '',
      job_title: job.title || '',
      start_date: job.start
        ? `${job.start.year}-${String(job.start.month + 1).padStart(2, '0')}-${String(job.start.day || 1).padStart(2, '0')}`
        : '',
      end_date: job.end
        ? `${job.end.year}-${String(job.end.month + 1).padStart(2, '0')}-${String(job.end.day || 1).padStart(2, '0')}`
        : '',
      description: job.description || '',
    }));

    const formattedEducationHistory = data.educations.map((education) => ({
      institution: education.schoolName || '',
      degree: education.degree || '',
      field_of_study: education.fieldOfStudy || '',
      start_date: education.start
        ? `${education.start.year}-${String(education.start.month + 1).padStart(2, '0')}-${String(education.start.day || 1).padStart(2, '0')}`
        : '',
      end_date: education.end
        ? `${education.end.year}-${String(education.end.month + 1).padStart(2, '0')}-${String(education.end.day || 1).padStart(2, '0')}`
        : '',
    }));

    // Set current_job_title and current_employer from latest job entry of employment history
    const latestEmployment = formattedEmploymentHistory.find((job) => !job.end_date);
    if (latestEmployment) {
      setFormData({
        ...formData,
        current_job_title: latestJob?.job_title || '',
        current_employer: latestJob?.company || '',
      });
    }

    // Reverse the formatted employment and education history to display the latest entry first
    formattedEmploymentHistory.reverse(); 
    formattedEducationHistory.reverse();

    setEmploymentHistory([...employmentHistory, ...formattedEmploymentHistory]);
    setEducationHistory([...educationHistory, ...formattedEducationHistory]);
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

      const options = {
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url',
        params: {
          url: value
        },
        headers: {
          'x-rapidapi-key': 'bb3b2f3979mshab4732d09c1d9c8p15569fjsn11af407e6669',
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
      };

      try {
        setLoading(true);
        // (DUMMY CODE BELOW) Implement fetch data using LinkedIn API
        const response = await api.request(options);
        console.log("Linked In Profile Found: ", response.data);
        if (response.data) {
          processLinkedInData(response.data);
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

    const isValid = educationFormRef.current.validateFields();
    if (!isValid) {
      return; // If validation fails, stop the submission
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Submit main registration form data
      const response = await api.post('/api/register', formData);
      console.log('User Registered:', response.data);

      // Extract token
      const token = response.data.token;

      localStorage.setItem('token', token);

      // Function to submit a single employment history entry
      const submitEmploymentHistory = async (history) => {
        await api.post('/api/add-employment-history', history);
        console.log('Employment History Entry Added');
      };

      // Function to submit a single education history entry
      const submitEducationHistory = async (history) => {
        await api.post('/api/add-education-history', history);
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
      console.log('Error during submission:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="signup-page">
        {loading && <CircularLoader />}
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
            <form onSubmit={handleSubmit} className="w-100" noValidate>
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
                      ref={educationFormRef}
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

            </form>
          </div>
        </div>

      </div>

      <MainFooter />
    </>
  );
};

export default Signup;
