import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import useAPICall from "../api/useAPICall";
import { useAuthContext } from "../hooks/useAuthContext";

const EditProfileModal = ({ isOpen, onClose, user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const callAPI = useAPICall();
  const { setAuthUser } = useAuthContext();

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || user.name || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await callAPI("users/update", "PUT", {
        name: formData.name,
        bio: formData.bio,
        profilePicture: formData.profilePicture
      });

      // Update the user data in parent component
      if (onUserUpdate) {
        onUserUpdate(response.user);
      }

      // Update auth context if this is the current user
      setAuthUser(prev => ({
        ...prev,
        name: response.user.name,
        fullName: response.user.name,
        bio: response.user.bio,
        profilePicture: response.user.profilePicture
      }));

      onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
              maxLength={50}
            />
          </div>

          {/* Bio Field */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
              maxLength={160}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bio.length}/160
            </div>
          </div>

          {/* Profile Picture URL Field */}
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    fullName: PropTypes.string,
    name: PropTypes.string,
    bio: PropTypes.string,
    profilePicture: PropTypes.string,
  }),
  onUserUpdate: PropTypes.func,
};

export default EditProfileModal;
