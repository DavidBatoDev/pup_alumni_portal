import React, { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

import './Profile.css';

const ProfileSettings = () => {
  const { profile, address, employmentHistory, educationHistory } = useOutletContext();

  // const profileImage = profile?.profile_picture
  //   ? `/path/to/images/${profile.profile_picture}` // Adjust path to actual image directory if needed
  //   : "https://via.placeholder.com/100";

  const profileImage = "https://via.placeholder.com/100";

  // Create local state for employment and education history to handle editing
  const [editableEmploymentHistory, setEditableEmploymentHistory] = useState([...employmentHistory]);
  const [editableEducationHistory, setEditableEducationHistory] = useState([...educationHistory]);

  // State to keep track of which rows are currently being edited
  const [editingEmploymentId, setEditingEmploymentId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);


  // Handle changes for employment history fields
  const handleEmploymentChange = (id, field, value) => {
    const updatedHistory = editableEmploymentHistory.map((job) =>
      job.employment_id === id ? { ...job, [field]: value } : job
    );
    setEditableEmploymentHistory(updatedHistory);
  };

  // Handle changes for education history fields
  const handleEducationChange = (id, field, value) => {
    const updatedEducation = editableEducationHistory.map((edu) =>
      edu.education_id === id ? { ...edu, [field]: value } : edu
    );
    setEditableEducationHistory(updatedEducation);
  };

  // Handle saving changes for employment history
  const saveEmploymentChanges = (id) => {
    setEditingEmploymentId(null);
    // console.log("Saved employment data:", editableEmploymentHistory);
    const updatedEmployment = editableEmploymentHistory.find((job) => job.employment_id === id);
    axios
      .put(`/api/update-employment-history/${id}`, updatedEmployment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Employment history updated successfully:', response.data.data);
          setEditingEmploymentId(null); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating employment history:', error);
      });

  };

  // Handle saving changes for education history
  const saveEducationChanges = (id) => {
    setEditingEducationId(null); // Exit editing mode
    // console.log("Saved education data:", editableEducationHistory);

    const updatedEducation = editableEducationHistory.find((edu) => edu.education_id === id);

    axios
      .put(`http://localhost:8000/api/update-education-history/${id}`, updatedEducation, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Education history updated successfully:', response.data.data);
          setEditingEducationId(null); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating education history:', error);
      });

  };

  return (
    <>
      <div className="card mb-4 profile-section">
        <h3 className="card-title">General Info</h3>
        <div className="row gap-3 align-items-center">

          {/* Profile Picture */}
          <div className="d-flex align-items-center justify-content-between">
            <div className='d-flex gap-2 align-items-center'>
              <div className="profile-image-container ">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image rounded-circle img-fluid"
                />
              </div>
              <div className='d-flex flex-column'>
                <label className="form-label">Profile Picture</label>
                <p className="">{profile?.profile_picture + " under 10MB" || "No Image Provided"}</p>
              </div>

            </div>
            <div className="d-flex gap-1">
              <button className="btn btn-outline-secondary btn-sm">Upload New Picture</button>
              <button className="btn btn-outline-danger btn-sm ms-2">Delete Picture</button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="col-md-10">
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder={profile?.first_name} disabled />
              </div>
              <div className="col">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder={profile?.last_name} disabled />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={profile?.email} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" placeholder={profile?.phone || 'None Provided'} disabled />
              </div>
            </div>
            <button className="btn btn-primary">Save New Changes</button>
          </div>
        </div>
      </div>

      {/* Personal Information & Contact Details Section */}
      <div className="card mb-4 profile-section">

        <h3 className="card-title">Personal Information & Contact Details</h3>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" value={profile?.date_of_birth || ''} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" placeholder={`${address['city']}, ${address['state']}`} disabled />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">LinkedIn Profile</label>
            <input type="text" className="form-control" placeholder={profile.linkedin_profile || 'Not Provided'} />
          </div>
        </div>

        <div>
          <button className="btn btn-primary">Save New Changes</button>
        </div>

      </div>

      {/* Career & Education History Section */}
      <div className="card mb-4 profile-section">
        <h3 className="card-title">Career & Education History</h3>
        {/* Employment History */}
        <h5>Employment History</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editableEmploymentHistory.length > 0 ? (
              editableEmploymentHistory.map((job) => (
                <tr key={job.employment_id}>
                  <td>
                    {editingEmploymentId === job.employment_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={job.job_title}
                        onChange={(e) => handleEmploymentChange(job.employment_id, 'job_title', e.target.value)}
                      />
                    ) : (
                      job.job_title
                    )}
                  </td>
                  <td>
                    {editingEmploymentId === job.employment_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={job.company}
                        onChange={(e) => handleEmploymentChange(job.employment_id, 'company', e.target.value)}
                      />
                    ) : (
                      job.company
                    )}
                  </td>
                  <td>
                    {editingEmploymentId === job.employment_id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={job.start_date}
                        onChange={(e) => handleEmploymentChange(job.employment_id, 'start_date', e.target.value)}
                      />
                    ) : (
                      new Date(job.start_date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingEmploymentId === job.employment_id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={job.end_date || ''}
                        onChange={(e) => handleEmploymentChange(job.employment_id, 'end_date', e.target.value)}
                      />
                    ) : (
                      job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Present'
                    )}
                  </td>
                  <td>
                    {editingEmploymentId === job.employment_id ? (
                      <div className="d-flex flex-sm-wrap">
                        <button className="btn btn-success btn-sm" onClick={() => saveEmploymentChanges(job.employment_id)}>Save</button>
                        <button className="btn btn-sm btn-danger">Remove</button>
                      </div>
                    ) : (
                      <button className="btn btn-warning btn-sm" onClick={() => setEditingEmploymentId(job.employment_id)}>Edit</button>

                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No employment history available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Education History */}
        <h5>Education History</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Degree</th>
              <th>Field of Study</th>
              <th>Institution</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editableEducationHistory.length > 0 ? (
              editableEducationHistory.map((edu) => (
                <tr key={edu.education_id}>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.education_id, 'degree', e.target.value)}
                      />
                    ) : (
                      edu.degree
                    )}
                  </td>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={edu.field_of_study}
                        onChange={(e) => handleEducationChange(edu.education_id, 'field_of_study', e.target.value)}
                      />
                    ) : (
                      edu.field_of_study
                    )}
                  </td>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(edu.education_id, 'institution', e.target.value)}
                      />
                    ) : (
                      edu.institution
                    )}
                  </td>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={edu.start_date}
                        onChange={(e) => handleEducationChange(edu.education_id, 'start_date', e.target.value)}
                      />
                    ) : (
                      new Date(edu.start_date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={edu.end_date || ''}
                        onChange={(e) => handleEducationChange(edu.education_id, 'end_date', e.target.value)}
                      />
                    ) : (
                      edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'
                    )}
                  </td>
                  <td>
                    {editingEducationId === edu.education_id ? (
                      <div>
                        <button className="btn btn-success btn-sm" onClick={() => saveEducationChanges(edu.education_id)}>Save</button>
                        <button className="btn btn-sm btn-danger">Remove</button>
                      </div>
                    ) : (
                      <button className="btn btn-warning btn-sm" onClick={() => setEditingEducationId(edu.education_id)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No education history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </>
  );
}

export default ProfileSettings;