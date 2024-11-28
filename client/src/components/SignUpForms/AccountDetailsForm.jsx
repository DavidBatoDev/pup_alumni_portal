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
  const [alumniData, setAlumniData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedAlumni, setVerifiedAlumni] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [verificationCheckInProgress, setVerificationCheckInProgress] =
    useState(false);

  useEffect(() => {
    if (isEmailOrStudentNumberValid) {
      setEmailOrStudentNumberEntered(true);
    }
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

    console.log(emailOrStudentNumberValidation);

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
    // if (emailOrStudentNumberEntered || validateEmailField()) {
    if (emailOrStudentNumberEntered || validateEmailOrStudentNumberField()) {
      try {
        setEmailError("");
        const requestParamsOrBody = checkIfEmailOrStudentNumber(
          emailOrStudentNumberField
        );
        let checkAlumniResponse;
        if (requestParamsOrBody === "email") {
          checkAlumniResponse = await axios.post(`/api/check-alumni`, {
            email: emailOrStudentNumberField,
          });
        } else if (requestParamsOrBody === "student_number") {
          checkAlumniResponse = await axios.post(`/api/check-alumni`, {
            student_number: emailOrStudentNumberField,
          });
        } else {
          setEmailError("There was an error checking your email or password.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        console.log(checkAlumniResponse.status);
        if (checkAlumniResponse.status == 201) {
          setLoading(true);
          let response;
          if (requestParamsOrBody === "email") {
            console.log('checking graduates with email')
            response = await axios.get(`/api/graduates/search`, {
              params: { email: emailOrStudentNumberField },
            });
          } else if (requestParamsOrBody === "student_number") {
            console.log('checking graduates with student number')
            response = await axios.get(`/api/graduates/search`, {
              params: { student_number: emailOrStudentNumberField },
            });
          }
          const emailExists = response.data.success;
          setIsEmailVerified(emailExists);
          setAlumniData(response.data.data);
          setShowModal(true);
        } else if (checkAlumniResponse.status == 200) {
          setEmailError("Account already exists with this email/student number.");
        }
      } catch (error) {
        console.error(error);
        setIsEmailVerified(false);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    if (isEmailVerified) {
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
    }
    // setEmailOrStudentNumberEntered(true);
    // emailOrStudentNumberIsValid()
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
            alumniData?.graduation_date.split('-')[0],
            alumniData?.program,
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

  console.log(emailOrStudentNumberField);

  return (
    <div className="form-section">
      {emailOrStudentNumberEntered ? (
        <h3 className="section-title">ACCOUNT DETAILS</h3>
      ) : (
        <>
          <h2 className="welcome-text mb-1">Welcome Alumni!</h2>
          <p className="login-description text-justify">
            Welcome to our alumni portal. Please verify your email to proceed.
          </p>
        </>
      )}

      {!emailOrStudentNumberEntered && (
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
                  validation.emailOrStudentNumberField ? "" : "is-invalid"
                }`}
                name="email"
                placeholder="johndoe@gmail.com"
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

      {emailOrStudentNumberEntered && (
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
                <div className="invalid-feedback">
                  Valid email is required
                </div>
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
          <button className="btn btn-danger" onClick={handleNextClick}>
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
              {isEmailVerified ? (
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
                  No account associated with this email. Would you like to
                  continue with the provided email?
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                {isEmailVerified
                  ? "Cancel"
                  : "Try Another Email or Student Number"}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleModalConfirm}
              >
                {isEmailVerified ? "Send Verification" : "Continue"}
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
