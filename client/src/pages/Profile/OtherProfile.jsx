import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from "../../assets/images/pup-login-banner.jpg";
import "./Profile.css";

const OtherProfile = () => {
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkedin_url = "https://linkedin.com/juandelacruz";
  const { alumniId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/alumni/${alumniId}`);
        setProfile(response.data.data);
        setAddress(response.data.data.address);
        setEmploymentHistory(response.data.data.employment_history || []);
        setEducationHistory(response.data.data.education_history || []);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [alumniId]);

  const sortedEmploymentHistory = employmentHistory.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA; // For descending order
  });

  const sortedEducationHistory = educationHistory.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA; // For descending
  });

  return (
    <>
      <BannerSmall
        bannerTitle={`Connect with ${profile?.first_name}`}
        bannerImage={bannerImage}
      />

      {loading && <CircularLoader />}

      <div className="other-profile-container">
        <div className="back-button-op" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </div>

        {/* Profile Overview */}
        <div className="card mb-4 profile-section">
          <div className="profile-overview-header"></div>
          <div className="profile-overview-container w-100">
            {/* Profile Image */}
            <div className="profile-image-container">
              <img
                src={profile?.profile_picture}
                alt="Profile"
                className="profile-image rounded-circle img-fluid"
              />
            </div>

            {/* Profile Details */}
            <div className="d-flex flex-column w-100 profile-details">
              <div className="d-flex justify-content-between profile-details-flex">
                <div className="d-flex flex-column">
                  <h2 className="card-title mb-0">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  {/* <p className="card-text">
                    {address?.city}, {address?.state}
                  </p> */}
                  <p className="card-subtitle mb-2">
                    {/* work icon */}
                    <i className="fas fa-briefcase mx-1"></i>
                    {profile?.employment_history?.length > 0
                      ? `${sortedEmploymentHistory[0].job_title} at ${sortedEmploymentHistory[0].company}`
                      : "No current job title and employer"}
                  </p>
                </div>
                <div className="d-flex flex-column align-bottom justify-content-end mb-2">
                  {linkedin_url && (
                    <a
                      href={linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin"
                    >
                      {linkedin_url.replace("https://", "")}
                    </a>
                  )}
                </div>
              </div>
              {/* Contact Information */}
              <div className="profile-contacts">
                <p className="card-text">
                  <strong>Email:</strong> {profile?.email}
                </p>
                <p className="card-text">
                  <strong>Phone:</strong> {profile?.phone || "None Provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience Section */}
        <div className="card profile-section mb-4">
          <h3 className="card-title">Professional Experience</h3>
          {employmentHistory.length > 0 ? (
            sortedEmploymentHistory.map((job) => (
              <div
                className="card profile-experience mb-2"
                key={job?.employment_id}
              >
                <div className="card-body">
                  <div className="d-flex">
                    <div className="d-flex flex-column mx-2">
                      <i className="fas fa-briefcase"></i> {/* Work Icon */}
                      <div className="v-line"></div> {/* Vertical Line */}
                    </div>
                    <div className="card-contents-container">
                      <h4 className="card-title">{job?.company}</h4>
                      <p className="card-text">{job?.job_title}</p>
                      <p className="card-subtitle">
                        {new Date(job?.start_date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {job?.end_date
                          ? new Date(job?.end_date).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" }
                            )
                          : "Present"}
                      </p>
                      {job?.description && (
                        <p className="card-text profile-description">
                          {job?.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No employment history available.</p>
          )}
        </div>

        {/* Education History Section */}
        <div className="card profile-section mb-4">
          <h3 className="card-title">Education History</h3>
          {educationHistory.length > 0 ? (
            sortedEducationHistory.map((education) => (
              <div
                className="card profile-education mb-2"
                key={education?.education_id}
              >
                <div className="card-body">
                  <div className="d-flex">
                    <div className="d-flex flex-column mx-2">
                      <i className="fas fa-graduation-cap"></i>{" "}
                      {/* Education Icon */}
                      <div className="v-line"></div> {/* Vertical Line */}
                    </div>
                    <div className="card-contents-container">
                      <h4 className="card-title">{education?.institution}</h4>
                      <p className="card-text">{education?.degree}</p>
                      <p className="card-text">{education?.field_of_study}</p>
                      <p className="card-subtitle">
                        {new Date(education?.start_date).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}{" "}
                        -{" "}
                        {education?.end_date
                          ? new Date(education?.end_date).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" }
                            )
                          : "Present"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No education history available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OtherProfile;
