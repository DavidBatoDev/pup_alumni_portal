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
            <div
              className={`alumni-card mb-4 ${viewMode}`}
              key={profile.alumni_id}
            >
              <div className="alumni-profile-section">
                <img
                  src={
                    profile?.profile_picture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  className="img-fluid rounded-circle alumni-profile-img mr-2"
                  alt=""
                />

                <div className="alumni-card-contents">
                  <h5 className="card-title mb-1">
                    {`${profile.first_name} ${profile.last_name}`}
                  </h5>
                  {
                    // if no current job title and employer, display "No current job title and employer"

                    profile?.employment_history.length > 1 ? (
                      <p className="mb-0 w-10">
                        {/* work icon here */}
                        <i className="fas fa-briefcase mx-2"></i>
                        <span className="">
                          {
                            profile?.employment_history[
                              profile?.employment_history.length - 1
                            ]?.job_title
                          }
                        </span>{" "}
                        at{" "}
                        {
                          profile?.employment_history[
                            profile?.employment_history.length - 1
                          ]?.company
                        }
                      </p>
                    ) : (
                      <p className="mb-0 w-10">
                        No current job title and employer
                      </p>
                    )
                  }
                  <p className="ac-address-text mb-0">
                    {/* place icon here */}
                    <i className="fas fa-map-marker-alt mx-2"></i>
                    {profile?.address[0]?.city}, {profile?.address[0]?.country}
                  </p>
                  <p className="ac-batch-year mb-0">
                    Batch {profile.graduation_year}
                  </p>
                </div>
              </div>
              <div className="connect-btn-container d-flex justify-content-end">
                <button
                  onClick={() => navigate(`/profile/${profile.alumni_id}`)}
                  className="btn btn-primary"
                >
                  See Info
                </button>
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
