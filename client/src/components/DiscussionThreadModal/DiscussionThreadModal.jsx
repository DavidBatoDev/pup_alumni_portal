import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Quill's default theme
import ModalContainer from "../ModalContainer/ModalContainer";
import "./DiscussionThreadModal.css";

const DiscussionThreadModal = ({ showModal, closeModal, onSubmitThread, thread = null, isEditing = false }) => {
  const { user } = useSelector((state) => state.user); // Get user data

  // Thread Data (Request Body)
  const [threadData, setThreadData] = useState({
    title: thread?.title || "",
    description: thread?.description || "",
  });
  const [tags, setTags] = useState(thread?.tags || []); // Manage tags
  const [showImageUpload, setShowImageUpload] = useState(
    thread?.images?.length > 0 || false
  );
  const [images, setImages] = useState(thread?.images?.map(image => image.image_url) || []); // Store uploaded images
  const [imageFiles, setImageFiles] = useState([]); // Store actual file objects
  const [validation, setValidation] = useState({
    title: true,
    description: true
  })

  useEffect(() => {
    if (thread) {
      setThreadData({
        title: thread.title || "",
        description: thread.description || "",
      });
      setTags(thread.tags || []);
      // console.log(thread.images);
      // setImages(thread.images?.map(image => image.image_path) || []);
      // setImageFiles(thread.images?.map(image => image.image_url) || []); // Correctly set imageFiles
    }
  }, [thread]);

  const resetValidation = () => {
    setValidation({
      title: true,
      description: true
    });
  };

  const validateFields = () => {
    const newValidation = {
      title: threadData.title.trim().length > 0 && threadData.title !== "",
      description: threadData.description.replace(/<(.|\n)*?>/g, '').trim() === '' ? false : true
    }
    console.log(newValidation);
    setValidation(newValidation);
    return Object.values(newValidation).every((value) => value === true);
  };

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
    const imagePreviews = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs
    setImages((prevImages) => [...prevImages, ...imagePreviews]); // Add to existing images
    setImageFiles((prevFiles) => [...prevFiles, ...files]); // Add to existing file objects
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image at specific index
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file at specific index
  };

  // Handle tags
  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      const newTag = e.target.value.trim();
      if (newTag && !tags.some(tag => tag.name === newTag)) {
        setTags((prevTags) => [...prevTags, { name: newTag }]); // Add new tag if it doesn't exist
      }
      e.target.value = ""; // Clear input
      e.preventDefault(); // Prevent form submission
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.name !== tagToRemove)); // Remove specific tag
  };

  // Handle submit
  const handleSubmit = () => {
    // Validation
    if (!validateFields()) return;

    if (!isEditing) {
      // Creating Thread:
      const formData = new FormData();
      formData.append('title', threadData.title);
      formData.append('description', threadData.description);
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      // Pass thread data to the parent component for API call and reset form state
      onSubmitThread(formData);
    } else {
      // Editing Thread:
      const updatedData = {};
      if (threadData.title !== thread.title) updatedData.title = threadData.title;
      if (threadData.description !== thread.description) updatedData.description = threadData.description;
      if (JSON.stringify(tags) !== JSON.stringify(thread.tags)) updatedData.tags = tags;
      if (imageFiles.length > 0) updatedData.images = imageFiles;

      // Pass updated data to the parent component for API call
      onSubmitThread(updatedData);
    }

    setTimeout(() => {
      resetFormState();
      closeModal();
    }, 2000); // Keep the modal open for 2 seconds
  };

  const resetFormState = () => {
    resetValidation();
    setThreadData({ title: "", description: "" }); // Reset form
    setImages([]); // Clear uploaded images
    setImageFiles([]); // Clear file objects
    setTags([]);
  }

  const handleUserClose = () => {
    if (!isEditing) { resetFormState(); }
    closeModal();
  }

  return (
    <ModalContainer
      showModal={showModal}
      closeModal={handleUserClose}
      title={isEditing ? "Edit Thread" : "Create Thread"} // Change title based on the operation
    >
      <div className="discussion-thread-modal">
        {/* Header */}
        <div className="discussion-modal-header d-flex align-items-center">
          <img
            src={`http://localhost:8000/storage/${user?.profile_picture}`}
            alt="User"
            className="discussion-profile-img"
          />
          <h6 className="discussion-username">{`${user?.first_name} ${user?.last_name}`}</h6>
        </div>

        {/* Body */}
        <div className="discussion-modal-body">
          {/* Thread Title */}
          <textarea
            name="title"
            className={`discussion-thread-title-input ${validation.title ? '' : 'is-invalid'}`}
            placeholder="Title"
            rows="1"
            value={threadData.title}
            onChange={handleInputChange}
          ></textarea>
          {!validation.title && (
            <div className="invalid-feedback m-0 raleway">Title is required</div>
          )}
          {!validation.description && (
            <div className="invalid-feedback m-0 raleway">Your post description is required</div>
          )}

          {/* Thread Description with Markdown Support */}
          <div className={`discussion-thread-description `}>
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
                  {tag.name}
                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => handleRemoveTag(tag.name)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>


          {/* Photo Upload Section */}
          {showImageUpload && (
            <div className="discussion-image-upload">
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
                  className="discussion-image-upload-area"
                  onClick={() =>
                    document.getElementById("image-upload-input").click()
                  }
                >
                  <i className="fas fa-plus-circle discussion-image-upload-icon"></i>
                  <p>Add Photos</p>
                </div>
              ) : (
                <>
                  <div className="discussion-image-preview-container">
                    {images.map((image, index) => (
                      <div key={index} className="discussion-image-preview">
                        <img src={image} alt={`Preview ${index}`} />
                        <button
                          className="discussion-remove-image-btn"
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
                  <div className="discussion-add-more-container">
                    <button
                      className="discussion-add-more-btn"
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
        <div className="discussion-modal-footer d-flex justify-content-between align-items-center">
          <div className="discussion-post-options d-flex gap-3">
            <button
              className={`discussion-option-btn ${showImageUpload ? "active" : ""
                }`}
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <i className="fas fa-image"></i>
            </button>
          </div>
          <button
            className="btn btn-primary discussion-post-btn"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default DiscussionThreadModal;