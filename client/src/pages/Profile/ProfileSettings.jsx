import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import './Profile.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/userSlice';

const ProfileSettings = () => {
  // const { profile, address, employmentHistory, educationHistory } = useOutletContext();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [personalInfo, setPersonalInfo] = useState({
    date_of_birth: '',
    linkedin_profile: '',
  });
  const [profilePicture, setProfilePicture] = useState('');
  const [address, setAddress] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create local state for employment and education history to handle editing
  const [editableAddress, setEditableAddress] = useState({ ...address });
  const [editableEmploymentHistory, setEditableEmploymentHistory] = useState([...employmentHistory]);
  const [editableEducationHistory, setEditableEducationHistory] = useState([...educationHistory]);

  // State to keep track of which rows are currently being edited
  // const [editingAddressId, setEditingAddressId] = useState(null); // Pending for change in backend to use address_id
  const [editingEmploymentId, setEditingEmploymentId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);

  const [alert, setAlert] = useState({
    severity: '',
    message: '',
  });

  useEffect(() => {
    // Set up axios request with Authorization header
    axios
      .get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProfile({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            phone: response.data.data.phone,
          })
          setPersonalInfo({
            date_of_birth: response.data.data.date_of_birth,
            linkedin_profile: response.data.data.linkedin_profile,
          });
          setProfilePicture(response.data.data.profile_picture);
          setAddress(response.data.data.address);
          setEmploymentHistory(response.data.data.employment_history || []);
          setEducationHistory(response.data.data.education_history || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCloseAlert = () => {
    setAlert({
      severity: '',
      message: '',
    });
  };

  const handleUpdateProfile = () => {
    const body = new FormData();
    body.append('first_name', profile.first_name);
    body.append('last_name', profile.last_name);
    body.append('phone', profile.phone);
    if (user.email !== profile.email) {
      body.append('email', profile.email);
    }
    if (profile.profile_picture) {
      body.append('profile_picture', profile.profile_picture);
    }
    axios
      .post('/api/update-profile', body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Profile updated successfully:', response.data.data);
          setAlert({
            severity: 'success',
            message: 'Profile updated successfully',
          });
          setProfile({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            phone: response.data.data.phone
          })
          dispatch(updateUser({user: response.data.data}));
        }
      })
      .catch((error) => {
        const errorMsg = Object.keys(error.response.data.message)[0];
        console.error('Error updating profile:', error);
        setAlert({
          severity: 'error',
          message: error.response.data.message[errorMsg],
        });
      }).finally(() => {
        setTimeout(() => {
          handleCloseAlert();
        }, 5000);
      })
  }

  const handleUpdatePersonalInfo = () => {
    axios
      .post('/api/update-profile', personalInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Personal info updated successfully:', response.data.data);
          setAlert({
            severity: 'success',
            message: 'Personal info updated successfully',
          });
          setPersonalInfo({
            date_of_birth: response.data.data.date_of_birth,
            linkedin_profile: response.data.data.linkedin_profile,
          });
        }
      })
      .catch((error) => {
        console.error('Error updating personal info:', error);
        setAlert({
          severity: 'error',
          message: 'Error updating personal info',
        });
      }).finally(() => {
        setTimeout(() => {
          handleCloseAlert();
        }, 5000);
      })
  }
    

  const handlePhotoChange = (e) => {
    const linkForFile = URL.createObjectURL(e.target.files[0]);
    setProfilePicture(linkForFile);
    setProfile({
      ...profile,
      profile_picture: e.target.files[0],
    });
  }

  // Handle changes for address fields
  const handleAddressChange = (field, value) => {
    setEditableAddress({ ...editableAddress, [field]: value });
  };

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

  const handleChangeProfile = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleChangePersonalInfo = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
  }

  // Handle saving changes for address
  const saveAddressChanges = () => {
    console.log("Saved address data:", editableAddress);
    axios
      .put(`/api/update-address`, editableAddress, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Address updated successfully:', response.data.data);
          // Update the address in the context // Pending for change in backend to use address_id
          // updateAddress(response.data.data);
          // setEditingAddressId(null); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating address:', error);
      });
  }

  // Handle saving changes for employment history
  const saveEmploymentChanges = (id) => {
    setEditingEmploymentId(null);
    console.log("Saved employment data:", editableEmploymentHistory);
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
    console.log("Saved education data:", editableEducationHistory);

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

  const addNewAddress = () => {
    const newAddress = {
      address_id: `temp-${Date.now()}`,
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    };
    setEditableAddress(newAddress);
    // setEditingAddressId(newAddress.address_id); // Pending for change in backend to use address_id
  }

  // Add new employment row in edit mode
  const addNewEmployment = () => {
    const newEmployment = {
      employment_id: `temp-${Date.now()}`, // Temporary ID for new row
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
    };
    setEditableEmploymentHistory([...editableEmploymentHistory, newEmployment]);
    setEditingEmploymentId(newEmployment.employment_id);
  };

  // Add new education row in edit mode
  const addNewEducation = () => {
    const newEducation = {
      education_id: `temp-${Date.now()}`, // Temporary ID for new row
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
    };
    setEditableEducationHistory([...editableEducationHistory, newEducation]);
    setEditingEducationId(newEducation.education_id);
  };

  const prepareNewEmployment = (employment) => {
    return {
      ...employment,
      // Ensure the date fields have a valid value or set to null if missing
      start_date: employment.start_date || null,
      end_date: employment.end_date || null,
    };
  };

  // Save new address entry to server
  const saveNewAddress = (address) => {
    axios
      .post(`/api/add-address`, address, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('New address added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          // setEditableAddress(response.data.data);
          // setEditingAddressId(null);
        }
      })
      .catch((error) => {
        console.error('Error adding new address:', error);
      });
  };

  // Save new employment entry to server
  const saveNewEmployment = (employment) => {
    const validEmployment = prepareNewEmployment(employment);
    axios
      .post(`/api/add-employment-history`, validEmployment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('New employment added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEmploymentHistory((prev) =>
            prev.map((job) =>
              job.employment_id === validEmployment.employment_id ? response.data.data : job
            )
          );
          setEditingEmploymentId(null);
        }
      })
      .catch((error) => {
        console.error('Error adding new employment:', error);
      });
  };

  // Save new education entry to server
  const saveNewEducation = (education) => {
    axios
      .post(`/api/add-education-history`, education, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('New education added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEducationHistory((prev) =>
            prev.map((edu) => (edu.education_id === education.education_id ? response.data.data : edu))
          );
          setEditingEducationId(null);
        }
      })
      .catch((error) => {
        console.error('Error adding new education:', error);
      });
  };

  return (
    <>
      <div className="card mb-4 profile-section">
        {alert?.message && <CustomAlert severity={alert.severity} message={alert.message} onClose={handleCloseAlert} />}
        <h3 className="card-title">General Info</h3>
        <div className="row gap-3 align-items-center">

          {/* Profile Picture */}
          <div className="d-flex align-items-center profile-picture-settings">

            <div className="profile-image-container">
              <img src={profilePicture} alt="Profile" className="profile-image rounded-circle" />
            </div>

            <div className='d-flex flex-column ms-2'>
              <label className="form-label">Profile Picture</label>
              <p className="">{profile?.profile_picture + " under 10MB" || "No Image Provided"}</p>
            </div>

            <div className="d-flex ms-auto ps-auto gap-1 justify-content-start align-items-center btn-profile-button">
              <label className="btn btn-outline-secondary btn-sm" htmlFor="photo-upload">Upload Picture</label>
              <input id='photo-upload' type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              <button className="btn btn-outline-danger btn-sm ms-2">Delete Picture</button>
            </div>

          </div>

          {/* Profile Details Settings */}
          <div className="col-12 col-md-10 w-100">
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name='first_name' value={profile.first_name} onChange={handleChangeProfile}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name='last_name' value={profile.last_name} onChange={handleChangeProfile} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name='email' value={profile?.email || ''} onChange={handleChangeProfile} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" name='phone' value={profile?.phone} onChange={handleChangeProfile} />
              </div>
            </div>

            {/* Centering the button and adding responsive width */}
            <div className="d-flex">
              <button onClick={handleUpdateProfile} className="btn btn-primary">Save New Changes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Personal Information & Contact Details Section */}
      <div className="card mb-4 profile-section">

        <h3 className="card-title">Personal Information & Contact Details</h3>
        <div className="col-12 col-md-10 w-100">
          <div className="row mb-3">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" name='date_of_birth' value={personalInfo?.date_of_birth} onChange={handleChangePersonalInfo}  />
            </div>

            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">LinkedIn Profile</label>
              <input type="text" className="form-control" name='linkedin_profile' value={personalInfo?.linkedin_profile} onChange={handleChangePersonalInfo} />
            </div>

          </div>
        </div>

        <div>
          <button onClick={handleUpdatePersonalInfo} className="btn btn-primary">Save New Changes</button>
        </div>

      </div>

      {/* Address Information */}
      <div className='card mb-4 profile-section'>
        <h3 className="card-title">Address Information</h3>
        <h5>Address Table</h5>
        <div className='table-responsive'>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Street</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Postal Code</th>
                <th scope="col">Country</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                editableAddress.length > 0 ? (
                  editableAddress.map((address) => (
                    <tr key={address.address_id}>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.street || ''}
                            onChange={(e) => handleAddressChange('street', e.target.value)}
                          />
                        ) : (
                          address.street
                        )}
                      </td>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.city || ''}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                          />
                        ) : (
                          address.city
                        )}
                      </td>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.state || ''}
                            onChange={(e) => handleAddressChange('state', e.target.value)}
                          />
                        ) : (
                          address.state
                        )}
                      </td>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.postal_code || ''}
                            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                          />
                        ) : (
                          address.postal_code
                        )}
                      </td>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.country || ''}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                          />
                        ) : (
                          address.country
                        )}
                      </td>
                      <td>
                        {editingAddressId === address.address_id ? (
                          <div className="btn-group" role='edit-address'>
                            <button className="btn btn-success btn-sm btn-save" onClick={() =>
                              typeof address.address_id === 'string' && address.address_id.includes('temp')
                                ? saveNewAddress(address)
                                : saveAddressChanges(address.address_id)
                            }>
                              <i className="fa-regular fa-floppy-disk"></i>
                            </button>
                            <button className="btn btn-sm btn-danger btn-delete">
                              <i className="fa-regular fa-trash-can btn-delete"></i>
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-warning btn  btn-light btn-sm" onClick={() => setEditingAddressId(address.address_id)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* <td colSpan="5">No address available.</td> Note: Delete when address_id is implemented */}
                    <td>{address?.street}</td>
                    <td>{address?.city}</td>
                    <td>{address?.state}</td>
                    <td>{address?.postal_code}</td>
                    <td>{address?.country}</td>
                    <td>TBD</td>
                  </tr>
                )
              }
              {/* Add New Address Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewAddress}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

      {/* Career & Education History Section */}
      <div className="card mb-4 profile-section">
        <h3 className="card-title">Career & Education History</h3>
        {/* Employment History */}
        <h5>Employment History</h5>
        <div className='table-responsive'>


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
              {editableEmploymentHistory.length > 0 ? (
                editableEmploymentHistory.map((job) => (
                  <tr key={job.employment_id}>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.job_title || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'job_title', e.target.value)}
                        />
                      ) : (
                        job.job_title
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <textarea
                          className="form-control auto-resize"
                          value={job.description || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'description', e.target.value)}
                        />
                      ) : (
                        job.description
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.company || ''}
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
                          value={job.start_date || ''}
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
                        <div className="btn-group" role='edit-employment'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof job.employment_id === 'string' && job.employment_id.includes('temp')
                              ? saveNewEmployment(job)
                              : saveEmploymentChanges(job.employment_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger btn-delete">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEmploymentId(job.employment_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No employment history available.</td>
                </tr>
              )
              }
              {/* Add New Employment Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewEmployment}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Education History */}
        <h5>Education History</h5>
        <div className='table-responsive'>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Degree</th>
                <th scope="col">Field of Study</th>
                <th scope="col">Institution</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Actions</th>
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
                          value={edu.degree || ''}
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
                          value={edu.field_of_study || ''}
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
                          value={edu.institution || ''}
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
                          value={edu.start_date || ''}
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
                        <div className='btn-group' role='edit-education'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof edu.education_id === 'string' && edu.education_id.includes('temp')
                              ? saveNewEducation(edu)
                              : saveEducationChanges(edu.education_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger mx-1">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEducationId(edu.education_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
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
                  <button className="btn btn-outline-primary btn-sm" onClick={addNewEducation}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;