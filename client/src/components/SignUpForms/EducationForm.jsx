import React from 'react';
import './signUpForms.css';

const EducationForm = ({
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
}) => {
  return (
    <div className="form-section w-auto">
      <h3 className="section-title">EDUCATIONAL AND PROFESSIONAL INFORMATION</h3>

      {/* LinkedIn Input Field and Explanation */}
      <div className="form-group">
        <label>
          LinkedIn Profile (Optional) <span className="important-txt">*</span>
        </label>
        <p className="text-muted small">
          You can provide your LinkedIn profile link to automatically populate your educational and professional information. If not, please add them manually in the tables below.
        </p>
        <div className="input-group mb-3">
          <span className="input-group-text bg-white">
            <i className="fa-brands fa-linkedin"></i>
          </span>
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


      {/* Employment History Table */}
      <div className="form-group">
        <h5>Employment History</h5>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Job Title</th>
              <th scope="col">Description</th>
              <th scope="col">Company</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employmentHistory && employmentHistory.length > 0 ? (
              employmentHistory.map((job, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={job.job_title || ''}
                      onChange={(e) => handleEmploymentChange(index, 'job_title', e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control"
                      value={job.description || ''}
                      onChange={(e) => handleEmploymentChange(index, 'description', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={job.company || ''}
                      onChange={(e) => handleEmploymentChange(index, 'company', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={job.start_date || ''}
                      onChange={(e) => handleEmploymentChange(index, 'start_date', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={job.end_date || ''}
                      onChange={(e) => handleEmploymentChange(index, 'end_date', e.target.value)}

                    />
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEmployment(index)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No employment history available.</td>
              </tr>
            )}
            {/* Add New Employment Button */}
            <tr>
              <td colSpan="6">
                <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewEmployment}>
                  <i className="fa-solid fa-plus"></i> Add Employment
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* Education History Table */}
      <div className="form-group">
        <h5>Education History</h5>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Institution</th>
              <th scope="col">Degree</th>
              <th scope="col">Major</th>
              <th scope="col">Start Year</th>
              <th scope="col">End Year</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationHistory && educationHistory.length > 0 ? (
              educationHistory.map((edu, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.institution || ''}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.degree || ''}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.field_of_study || ''}
                      onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={edu.start_date || ''}
                      onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={edu.end_date || ''}
                      onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEducation(index)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No education history available.</td>
              </tr>
            )}
            {/* Add New Education Button */}
            <tr>
              <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewEducation}>
                      <i className="fa-solid fa-plus"></i> Add Education
                  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center submit-box">
        <div className="w-auto">
          <div className="form-footer">
            <div className="checkbox-section">
              <input type="checkbox" id="agreeInfo" required />
              <label htmlFor="agreeInfo">
                I hereby agree that the <a href="#">above information</a> is
                true and correct.
              </label>
            </div>
            <div className="checkbox-section">
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
        <div className="w-auto form-submit">
          <button type="submit" className="btn btn-danger">
            Submit & Register
          </button>
        </div>
      </div>

    </div>
  );
};

export default EducationForm;
