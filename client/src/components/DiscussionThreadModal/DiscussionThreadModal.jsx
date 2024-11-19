import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Quill's default theme
import ModalContainer from "../ModalContainer/ModalContainer";
import "./DiscussionThreadModal.css";

const DiscussionThreadModal = ({ showModal, closeModal, onCreateThread }) => {
  const [threadData, setThreadData] = useState({
    title: "",
    description: "",
  });

  const [showPhotoUpload, setShowPhotoUpload] = useState(false); // Toggle photo upload section visibility
  const [photos, setPhotos] = useState([]); // Store uploaded photos
  const [tags, setTags] = useState([]); // Manage tags

  // Handle input changes for thread title/description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setThreadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setThreadData((prev) => ({ ...prev, description: value })); // Update description with ReactQuill's value
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Get selected files
    const photoPreviews = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs
    setPhotos((prevPhotos) => [...prevPhotos, ...photoPreviews]); // Add to existing photos
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index)); // Remove photo at specific index
  };

  // Handle tags
  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      const newTag = e.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]); // Add new tag if it doesn't exist
      }
      e.target.value = ""; // Clear input
      e.preventDefault(); // Prevent form submission
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove)); // Remove specific tag
  };

  // Handle submit
  const handleSubmit = () => {
    if (!threadData.title.trim() || !threadData.description.trim()) {
      alert("Both title and description are required.");
      return;
    }

    console.log("Thread Data:", threadData);
    console.log("Uploaded Photos:", photos);
    console.log("Tags:", tags); // Log tags

    onCreateThread({ ...threadData, tags }); // Pass thread data to the parent
    setThreadData({ title: "", description: "" }); // Reset form
    setPhotos([]); // Clear uploaded photos
    setTags([]); // Clear tags
    closeModal();
  };

  return (
    <ModalContainer
      showModal={showModal}
      closeModal={closeModal}
      title="Create Thread"
    >
      <div className="discussion-thread-modal">
        {/* Header */}
        <div className="discussion-modal-header d-flex align-items-center">
          <img
            src="https://via.placeholder.com/40" // Replace with user's profile picture if available
            alt="User"
            className="discussion-profile-img"
          />
          <h6 className="discussion-username">Your Name</h6>
        </div>

        {/* Body */}
        <div className="discussion-modal-body">
          {/* Thread Title */}
          <textarea
            name="title"
            className="discussion-thread-title-input"
            placeholder="Title"
            rows="1"
            value={threadData.title}
            onChange={handleInputChange}
          ></textarea>

          {/* Thread Description with Markdown Support */}
          <div className="discussion-thread-description">
            <ReactQuill
              theme="snow"
              value={threadData.description}
              onChange={handleDescriptionChange}
              placeholder="Add a description"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              formats={[
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "align",
              ]}
              style={{ height: "150px" }}
            />
          </div>

          {/* Tags Section */}
          <div className="discussion-tags">
            <input
              type="text"
              className="add-tag-input"
              placeholder="Press enter to add a tag"
              onKeyDown={handleAddTag}
            />
            <div className="tags-container">
              {tags.map((tag, index) => (
                <div key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Upload Section */}
          {showPhotoUpload && (
            <div className="discussion-photo-upload">
              <input
                type="file"
                id="photo-upload-input"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {photos.length === 0 ? (
                <div
                  className="discussion-photo-upload-area"
                  onClick={() =>
                    document.getElementById("photo-upload-input").click()
                  }
                >
                  <i className="fas fa-plus-circle discussion-photo-upload-icon"></i>
                  <p>Add Photos</p>
                </div>
              ) : (
                <>
                  <div className="discussion-photo-preview-container">
                    {photos.map((photo, index) => (
                      <div key={index} className="discussion-photo-preview">
                        <img src={photo} alt={`Preview ${index}`} />
                        <button
                          className="discussion-remove-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="discussion-add-more-container">
                    <button
                      className="discussion-add-more-btn"
                      onClick={() =>
                        document.getElementById("photo-upload-input").click()
                      }
                    >
                      + Add More Photos
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="discussion-modal-footer d-flex justify-content-between align-items-center">
          <div className="discussion-post-options d-flex gap-3">
            <button
              className={`discussion-option-btn ${
                showPhotoUpload ? "active" : ""
              }`}
              onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            >
              <i className="fas fa-image"></i>
            </button>
          </div>
          <button
            className="btn btn-primary discussion-post-btn"
            onClick={handleSubmit}
            disabled={
              !threadData.title.trim() || !threadData.description.trim()
            }
          >
            Post
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default DiscussionThreadModal;
