import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AlumniCards.css";

const AlumniCards = ({ viewMode, profiles, loading }) => {
  return (
    <div className={`container alumni-cards-container ${viewMode}`}>
      {loading && <p>Loading...</p>}

      {!loading && profiles.length > 0 ? (
        <>
          {profiles.map((profile) => (
            <div className={`alumni-card mb-4 ${viewMode}`} key={profile.id}>
              <div className="alumni-profile-section">
                <img
                  src={profile.profile_picture}
                  className="img-fluid rounded-circle alumni-profile-img mr-2"
                  alt="Profile"
                />

                <div className="d-flex flex-column">
                  <h5 className="card-title mb-1">
                    {`${profile.first_name} ${profile.last_name}`}
                  </h5>
                  <p className="card-text mb-0 w-5">
                    <span>{profile.current_job_title}</span> at{" "}
                    <span>{profile.current_employer}</span>
                  </p>
                  <p className="card-text text-muted mb-0">
                    {profile.city}, {profile.country}
                  </p>
                  <p className="card-text mb-0 w-5 font-italic">
                    Batch {profile.graduation_year}
                  </p>
                </div>
              </div>
              <div className="connect-btn-container d-flex justify-content-end">
                <button className="btn btn-primary">Connect</button>
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
