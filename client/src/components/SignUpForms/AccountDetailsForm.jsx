import "./signUpForms.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CircularLoader from "../CircularLoader/CircularLoader";
import { useNavigate } from "react-router-dom";

const AccountDetailsForm = ({
  nextStep,
  formData,
  handleChange,
  changeDetails,
  setLoading,
  isEmailOrStudentNumberValid,
  emailOrStudentNumberIsValid,
  currentStep,
}) => {
  const navigate = useNavigate();
  const [emailOrStudentNumberField, setEmailOrStudentNumberField] =
    useState("");
  const [emailOrStudentNumberEntered, setEmailOrStudentNumberEntered] =
    useState(false);
  const [continueWithNoAccount, setContinueWithNoAccount] = useState(false);
  const [alumniData, setAlumniData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [verifiedAlumni, setVerifiedAlumni] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [verificationCheckInProgress, setVerificationCheckInProgress] =
    useState(false);

  useEffect(() => {
    if (isEmailOrStudentNumberValid) {
      setEmailOrStudentNumberEntered(true);

    }

    console.log("currentStep", currentStep);

  }, [currentStep]);

  const [validation, setValidation] = useState({
    email: true,
    student_number: true,
    password: true,
    password_confirmation: true,
    emailOrStudentNumberField: true,
  });

  const validateFields = () => {
    // check if email or student number is the provided value
    let emailOrStudentNumberValidation = false;
    if (emailOrStudentNumberField.includes("@")) {
      emailOrStudentNumberValidation =
        emailOrStudentNumberField.trim() !== "" &&
        /\S+@\S+\.\S+/.test(emailOrStudentNumberField);
    } else {
      emailOrStudentNumberValidation = emailOrStudentNumberField.trim() !== "";
    }
    const newValidation = {
      email:
        formData.email.trim() !== "" && /\S+@\S+\.\S+/.test(formData.email),
      student_number: formData.student_number.trim() !== "",
      password: formData.password.trim() !== "",
      password_confirmation:
        formData.password_confirmation.trim() !== "" &&
        formData.password === formData.password_confirmation,
      emailOrStudentNumberField: emailOrStudentNumberValidation,
    };

    setValidation(newValidation);

    // all should be true excpet for emailOrStudentNumberField
    return (
      newValidation.email &&
      newValidation.student_number &&
      newValidation.password &&
      newValidation.password_confirmation
    );
  };

  const validateEmailField = () => {
    const emailValid =
      formData.email.trim() !== "" && /\S+@\S+\.\S+/.test(formData.email);
    setValidation((prevValidation) => ({
      ...prevValidation,
      email: emailValid,
    }));
    return emailValid;
  };

  const validateEmailOrStudentNumberField = () => {
    let emailOrStudentNumberValidation = false;
    if (emailOrStudentNumberField.includes("@")) {
      emailOrStudentNumberValidation =
        emailOrStudentNumberField.trim() !== "" &&
        /\S+@\S+\.\S+/.test(emailOrStudentNumberField);
    }
    // if the first two characters are numbers, then it is a student number
    else if (emailOrStudentNumberField.substring(0, 4).match(/[0-9]/)) {
      emailOrStudentNumberValidation = emailOrStudentNumberField.trim() !== "";
    }
    setValidation((prevValidation) => ({
      ...prevValidation,
      emailOrStudentNumberField: emailOrStudentNumberValidation,
    }));

    return emailOrStudentNumberValidation;
  };

  const checkIfEmailOrStudentNumber = (value) => {
    if (value.includes("@")) {
      return "email";
    } else {
      return "student_number";
    }
  };

  const handleNextClick = async () => {
    console.log("validateEmailOrStudentNumberField", validateEmailOrStudentNumberField());
  
    if (validateEmailOrStudentNumberField()) {
      try {
        setEmailError("");
  
        // Determine if the input is an email or student number
        const requestParamsOrBody = checkIfEmailOrStudentNumber(emailOrStudentNumberField);

        if (requestParamsOrBody == "student_number") {
          const searchStudentNumber = await axios.get(`/api/graduates/search`, {
            params: { 'student_number': emailOrStudentNumberField }
          });

          if (!searchStudentNumber.data.success && searchStudentNumber.data.message === "No graduate found with the provided details.") {
            setEmailError("No graduate found with the provided Student Number. Please enter your email instead");
            return;
          }
        }
        
        // Perform the check for alumni based on the input type (email or student number)
        const checkAlumniResponse = await checkAlumni(requestParamsOrBody, emailOrStudentNumberField);
  
        if (checkAlumniResponse) {
          console.log('checkAlumniResponse', checkAlumniResponse);
  
          if (checkAlumniResponse.status === 201) {
            // If the response status is 201, check for graduates
            await handleGraduateSearch(requestParamsOrBody, emailOrStudentNumberField);
          } else if (checkAlumniResponse.status === 200) {
            // Handle case where account already exists
            setEmailError("Account already exists with this email/student number.");
          }
        }
      } catch (error) {
        console.error("Error during handleNextClick:", error);
        setIsEmailExists(false);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Helper function to handle alumni check (email or student number)
  const checkAlumni = async (type, value) => {
    try {
      console.log(`Making request for ${type}:`, value);
  
      const response = await axios.post(`/api/check-alumni`, {
        [type]: value, // Dynamically set the key based on the type (email or student_number)
      });
  
      return response;
    } catch (error) {
      console.error(`Error during axios.post for ${type}:`, error);
      setEmailError(`There was an issue checking your ${type}.`);
      return null; // Return null if there's an error to prevent further execution
    }
  };
  
  // Helper function to handle graduate search (email or student number)
  const handleGraduateSearch = async (type, value) => {
    try {
      console.log(`Checking graduates with ${type}`);
  
      const response = await axios.get(`/api/graduates/search`, {
        params: { [type]: value }, // Dynamically set the query param based on the type
      });

      console.log('response', response);

      if (!response.data.success && response.data.message === "No graduate found with the provided details.") {
        setShowModal(true);
        setIsEmailExists(false);
        setAlumniData({
          email_address: value,
        })
        return;
      }
  
      const emailExists = response.data.success;
      setIsEmailExists(emailExists);
      setAlumniData(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error(`Error during graduate search for ${type}:`, error);
      setEmailError("There was an issue fetching graduate data.");
    }
  };
  

  const handleModalConfirm = async () => {
    setShowModal(false);
    if (isEmailExists) {
      try {
        // Send the verification email
        setLoading(true);
        const response = await axios.post(`/api/send-verification-email`, {
          email: alumniData.email_address,
        });

        if (response.data.success) {
          setEmailError("");
          setShowVerificationModal(true);
          startVerificationCheck();
        }
      } catch (error) {
        console.error("Error sending email:", error);
        setEmailError("Failed to send verification email.");
      } finally {
        setLoading(false);
      }
    } else if (!isEmailExists) {
      setAlumniData({
        email_address: emailOrStudentNumberField,
      });
      handleChange(
        {
          target: {
            name: "email",
            value: emailOrStudentNumberField,
          },
        }
      )
      setEmailOrStudentNumberEntered(true);
      setContinueWithNoAccount(true);
      emailOrStudentNumberIsValid();
      
    } else {
      setEmailError("Failed to send verification email.");
      setTimeout(() => {
        setEmailError("Something went wrong. Please try again later. Redirecting to login page...");
        navigate("/login");
      }
      , 5000);
    }
  };

  const startVerificationCheck = () => {
    let elapsedTime = 0;
    setLoading(false);
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/graduates/check-verification`, {
          params: { email: alumniData.email_address },
        });
        if (response.data.success) {
          changeDetails(
            alumniData?.firstname,
            alumniData?.lastname,
            alumniData?.email_address,
            alumniData?.student_number,
            alumniData?.graduation_date.split("-")[0],
            alumniData?.program
          );
          clearInterval(interval);
          setVerificationCheckInProgress(false);
          setShowVerificationModal(false);
          setEmailOrStudentNumberEntered(true);
          emailOrStudentNumberIsValid();
          setVerifiedAlumni(true);
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
      elapsedTime += 5;
      if (elapsedTime >= 120) {
        clearInterval(interval);
        setVerificationCheckInProgress(false);
        setShowVerificationModal(false);
        navigate("/login");
        alert("Verification timeout. Please try again.");
      }
    }, 2000);
    setVerificationCheckInProgress(true);
  };

  const handleNextStep = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <div className="form-section">
      {emailOrStudentNumberEntered && !continueWithNoAccount ? (
        <h3 className="section-title">ACCOUNT DETAILS</h3>
      ) : (
        <>
          <h2 className="welcome-text mb-1">Welcome Alumni!</h2>
          <p className="login-description text-justify">
            Welcome to our alumni portal. Please verify your email to proceed.
          </p>
        </>
      )}

      {(!emailOrStudentNumberEntered && !continueWithNoAccount) && (
        <div className="form-group">
          <label>
            Personal Email or Student Number{" "}
            <span className="important-txt">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="text"
              className={`form-control ${
                validation.emailOrStudentNumberField ? "" : "is-invalid"
              }`}
              name="emailOrStudentNumber"
              placeholder="johndoe@gmail.com or 2000-00000-MN-0"
              value={emailOrStudentNumberField}
              onChange={(e) => setEmailOrStudentNumberField(e.target.value)}
              required
            />
            {!validation.emailOrStudentNumberField && (
              <div className="invalid-feedback">
                Valid email or student number is required
              </div>
            )}
          </div>
        </div>
      )}

      {(emailOrStudentNumberEntered || continueWithNoAccount) && (
        <>
          <div className="form-group">
            <label>
              Personal Email <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className={`form-control ${
                  validation.email ? "" : "is-invalid"
                }`}
                name="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {!validation.email && (
                <div className="invalid-feedback">Valid email is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>
              Student Number <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                className={`form-control ${
                  validation.student_number ? "" : "is-invalid"
                }`}
                name="student_number"
                placeholder="200X-MN-XXXX-X"
                value={formData.student_number}
                onChange={handleChange}
              />
              {!validation.student_number && (
                <div className="invalid-feedback">
                  Student number is required
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>
              Password <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <input
                type="password"
                className={`form-control ${
                  validation.password ? "" : "is-invalid"
                }`}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {!validation.password && (
                <div className="invalid-feedback">Password is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>
              Confirm Password <span className="important-txt">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <input
                type="password"
                className={`form-control ${
                  validation.password_confirmation ? "" : "is-invalid"
                }`}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              {!validation.password_confirmation && (
                <div className="invalid-feedback">Passwords must match</div>
              )}
            </div>
          </div>
        </>
      )}

      {verifiedAlumni && (
        <div className="alert alert-success" role="alert">
          Welcome back {alumniData?.firstname}!
        </div>
      )}

      {emailError && (
        <div className="alert alert-danger" role="alert">
          {emailError}
        </div>
      )}

      <div className="d-flex justify-content-between">
        <Link to="/login" className="sign-in-link">
          Already have an account?
        </Link>
        {emailOrStudentNumberEntered ? (
          <button className="btn btn-danger" onClick={handleNextStep}>
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleNextClick}
          >
            Send a Verification Email
          </button>
        )}
      </div>

      {/* Modal */}
      <div
        className={`modal email-popup glass fade ${showModal ? "show" : ""}`}
        tabIndex="11111"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Your Identity</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {isEmailExists ? (
                <div>
                  <p>
                    Account found with the email provided. Would you like to
                    continue with this account?
                  </p>
                  <div className="alumni-details">
                    <p>
                      <strong>Name:</strong> {alumniData?.firstname}{" "}
                      {alumniData?.lastname}
                    </p>
                    <p>
                      <strong>Student Number:</strong>{" "}
                      {alumniData?.student_number}
                    </p>
                    <p>
                      <strong>Program:</strong> {alumniData?.program}
                    </p>
                    <p>
                      <strong>Graduation Date:</strong>{" "}
                      {alumniData?.graduation_date}
                    </p>
                    <p className="text-danger">
                      A verification email will be sent to{" "}
                      {alumniData?.email_address}
                    </p>
                  </div>
                </div>
              ) : (
                <p>
                  No account is associated with this email or student number.
                  Would you like to continue with the provided information
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                {isEmailExists ? "Cancel" : "Try Another"}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleModalConfirm}
              >
                {isEmailExists ? "Send Verification" : "Still Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div
          className="modal fade show modal-email-verification"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Email Verification</h5>
              </div>
              <div className="modal-body">
                <p>
                  A verification link has been sent to your email. Please click
                  the link in your email to verify your account.
                </p>
                <p className="text-secondary">
                  We are checking for your email verification status...
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowVerificationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetailsForm;
