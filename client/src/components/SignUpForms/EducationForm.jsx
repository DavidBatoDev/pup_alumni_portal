import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './EducationForm.css';

const EducationForm = forwardRef(({
  nextStep,
  prevStep,
  formData,
  handleChange,
  handleLinkedInChange,
  handleEmploymentChange,
  handleEducationChange,
  addNewEmployment,
  addNewEducation,
  employmentHistory,
  educationHistory,
  handleDeleteEmployment,
  handleDeleteEducation
}, ref) => {
  const [error, setError] = useState('');

  const validateFields = () => {
    const agreeInfo = document.getElementById('agreeInfo').checked;
    const privacyPolicy = document.getElementById('privacyPolicy').checked;

    if (!agreeInfo || !privacyPolicy) {
      setError('You must agree to the terms and privacy policy.');
      return false;
    }

    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  return (
    <div className="edu-form-section w-auto">
      <h3 className="edu-form-section-title">EDUCATIONAL AND PROFESSIONAL INFORMATION</h3>

      {/* LinkedIn Profile Section */}
      <div className="edu-form-group linkedin-input">
        <label>
          LinkedIn Profile (Optional) <span className="edu-form-important-txt">*</span>
        </label>
        <p className="edu-form-text-muted small">
          You can provide your LinkedIn profile link to automatically populate your educational and professional information. If not, please add them manually.
        </p>
        <div className="edu-form-input-group mb-3">
          <input
            type="text"
            name="linkedin_profile"
            placeholder="LinkedIn Profile URL"
            value={formData.linkedin_profile}
            onChange={handleLinkedInChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Employment History Section */}
      <div className="edu-form-group">
        <h5>Employment History</h5>
        {employmentHistory && employmentHistory.length > 0 ? (
          employmentHistory.map((job, index) => (
            <div className="edu-form-employment-item" key={index}>
              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={job.job_title || ''}
                    onChange={(e) => handleEmploymentChange(index, 'job_title', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>Company</label>
                  <input
                    type="text"
                    className="form-control"
                    value={job.company || ''}
                    onChange={(e) => handleEmploymentChange(index, 'company', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group">
                <div className="w-100">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={job.description || ''}
                    onChange={(e) => handleEmploymentChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={job.start_date || ''}
                    onChange={(e) => handleEmploymentChange(index, 'start_date', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={job.end_date || ''}
                    onChange={(e) => handleEmploymentChange(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group mt-2">
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() => handleDeleteEmployment(index)}
                >
                  <i className="fa fa-trash"></i> Delete Employment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No employment history available.</p>
        )}
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={addNewEmployment}>
          <i className="fa fa-plus"></i> Add New Employment
        </button>
      </div>

      {/* Education History Section */}
      <div className="edu-form-group">
        <h5>Education History</h5>
        {educationHistory && educationHistory.length > 0 ? (
          educationHistory.map((education, index) => (
            <div className="edu-form-education-item" key={index}>
              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Degree</label>
                  <input
                    type="text"
                    className="form-control"
                    value={education.degree || ''}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>Institution</label>
                  <input
                    type="text"
                    className="form-control"
                    value={education.institution || ''}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group">
                <div className="w-100">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={education.description || ''}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={education.start_date || ''}
                    onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={education.end_date || ''}
                    onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group mt-2">
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() => handleDeleteEducation(index)}
                >
                  <i className="fa fa-trash"></i> Delete Education
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No education history available.</p>
        )}
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={addNewEducation}>
          <i className="fa fa-plus"></i> Add New Education
        </button>
      </div>

      {/* Submit Button */}
      <div className="d-flex justify-content-center edu-form-submit-box align-items-center">
        <div className="w-auto">
          <div className="edu-form-footer">
            <div className="edu-form-checkbox-section">
              <input type="checkbox" id="agreeInfo" required />
              <label htmlFor="agreeInfo">
                I hereby agree that the <a href="#">above information</a> is true and correct.
              </label>
            </div>
            <div className="edu-form-checkbox-section">
              <input type="checkbox" id="privacyPolicy" required />
              <label htmlFor="privacyPolicy">
                I’ve read and accept the <a href="#">Privacy Policy</a> *
              </label>
            </div>
          </div>
        </div>
        <div className="w-auto">
          <button className="btn btn-secondary" onClick={prevStep}>Back</button>
        </div>
        <div className="w-auto edu-form-submit">
          <button type="submit" className="btn btn-danger">
            Submit & Register
          </button>
        </div>
      </div>
      {error && <p className="edu-form-error-message text-center">{error}</p>}

    </div>
  );
});

export default EducationForm;
