import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AlumniCards.css";
import { useNavigate } from "react-router-dom";

const AlumniCards = ({ viewMode, profiles, loading }) => {
  const navigate = useNavigate();
  console.log(profiles);

  return (
    <div className={`container alumni-cards-container ${viewMode}`}>
      {loading && <p>Loading...</p>}



      {!loading && profiles.length > 0 ? (
        <>
          {profiles.map((profile) => (
            <div className={`alumni-card mb-4 ${viewMode}`} key={profile.alumni_id}>
              <div className="alumni-profile-section">
                <img
                  src={profile?.profile_picture || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                  className="img-fluid rounded-circle alumni-profile-img mr-2"
                  alt=""
                />

                <div className="d-flex flex-column">
                  <h5 className="card-title mb-1">
                    {`${profile.first_name} ${profile.last_name}`}
                  </h5>
                  <p className="mb-0 w-5">
                    <span className="">{profile.current_job_title}</span><span>{profile.current_employer}</span>
                  </p>
                  <p className="ac-address-text">
                    {profile?.address[0]?.city}, {profile?.address[0]?.country}
                  </p>
                  <p className="ac-batch-year">
                    Batch {profile.graduation_year}
                  </p>
                </div>
              </div>
              <div className="connect-btn-container d-flex justify-content-end">
                <button onClick={() => navigate(`/profile/${profile.alumni_id}`)} className="btn btn-primary">See Info</button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No profiles found.</p>
      )}
    </div>
  );
};

export default AlumniCards;
