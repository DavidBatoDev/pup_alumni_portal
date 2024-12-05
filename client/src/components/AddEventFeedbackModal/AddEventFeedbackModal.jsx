import React, { useState } from "react";
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Quill's default theme
import ModalContainer from "../ModalContainer/ModalContainer";
import "./AddEventFeedbackModal.css";

const AddEventFeedbackModal = ({ showModal, closeModal, onCreateEventFeedback }) => {
  const { user } = useSelector((state) => state.user); // Get user data

  // Event Feedback Data (Request Body)
  const [eventFeedbackData, setEventFeedbackData] = useState({
    feedback_text: "",
  });
  const [showImageUpload, setShowImageUpload] = useState(false); // Toggle image upload section visibility
  const [images, setImages] = useState([]); // Store uploaded images
  const [imageFiles, setImageFiles] = useState([]); // Store actual file objects
  const [validation, setValidation] = useState({
    feedback_text: true,
  });

  const resetValidation = () => {
    setValidation({
      feedback_text: true,
    });
  };

  const validateFields = () => {
    const newValidation = {
      feedback_text: eventFeedbackData.feedback_text.replace(/<(.|\n)*?>/g, '').trim() === '' ? false : true
    };
    console.log(newValidation);
    setValidation(newValidation);
    return Object.values(newValidation).every((value) => value === true);
  };

  // Handle input change for event description
  const handleDescriptionChange = (value) => {
    setEventFeedbackData((prev) => ({ ...prev, feedback_text: value })); // Update description with ReactQuill's value
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Get selected files
    const imagePreviews = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs
    setImages((prevImages) => [...prevImages, ...imagePreviews]); // Add to existing images
    setImageFiles((prevFiles) => [...prevFiles, ...files]); // Add to existing file objects
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image at specific index
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file at specific index
  };

  // Handle submit
  const handleSubmit = () => {
    // Validation
    validateFields();

    // Create FormData object
    const formData = new FormData();
    formData.append('feedback_text', eventFeedbackData.feedback_text);
    imageFiles.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });

    // Pass event feedback data to the parent component for API call and reset form state
    onCreateEventFeedback(formData);

    setTimeout(() => {
      resetFormState();
      closeModal();
    }, 2000); // Keep the modal open for 2 seconds
  };

  const resetFormState = () => {
    resetValidation();
    setEventFeedbackData({ feedback_text: "" }); // Reset form
    setImages([]); // Clear uploaded images
    setImageFiles([]); // Clear file objects
  };

  const handleUserClose = () => {
    resetFormState();
    closeModal();
  };

  return (
    <ModalContainer
      showModal={showModal}
      closeModal={handleUserClose}
      title="Create Event Feedback"
    >
      <div className="event-feedback-thread-modal">
        {/* Header */}
        <div className="event-feedback-modal-header d-flex align-items-center">
          <img
            src={`http://localhost:8000/storage/${user?.profile_picture}`}
            alt="User"
            className="event-feedback-profile-img"
          />
          <h6 className="event-feedback-username">{`${user?.first_name} ${user?.last_name}`}</h6>
        </div>

        {/* Body */}
        <div className="event-feedback-modal-body">
          {/* Event Description */}
          <div className={`event-feedback-thread-description `}>
            <ReactQuill
              theme="snow"
              value={eventFeedbackData.feedback_text}
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
          {!validation.feedback_text && (
            <div className="invalid-feedback m-0 raleway">Your post feedback_text is required</div>
          )}

          {/* Photo Upload Section */}
          {showImageUpload && (
            <div className="event-feedback-image-upload">
              <input
                type="file"
                id="image-upload-input"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {images.length === 0 ? (
                <div
                  className="event-feedback-image-upload-area "
                  onClick={() =>
                    document.getElementById("image-upload-input").click()
                  }
                >
                  <i className="fas fa-plus-circle event-feedback-image-upload-icon"></i>
                  <p>Add Photos</p>
                </div>
              ) : (
                <>
                  <div className="event-feedback-image-preview-container">
                    {images.map((image, index) => (
                      <div key={index} className="event-feedback-image-preview">
                        <img src={image} alt={`Preview ${index}`} />
                        <button
                          className="event-feedback-remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="event-feedback-add-more-container">
                    <button
                      className="event-feedback-add-more-btn"
                      onClick={() =>
                        document.getElementById("image-upload-input").click()
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
        <div className="event-feedback-modal-footer d-flex justify-content-between align-items-center">
          <div className="event-feedback-post-options d-flex gap-3">
            <button
              className={`event-feedback-option-btn ${showImageUpload ? "active" : ""}`}
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <i className="fas fa-camera event-feedback-option-icon"></i> Photos
            </button>
          </div>
          <div>
            <button
              className="event-feedback-submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default AddEventFeedbackModal;
