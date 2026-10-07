import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import apiRequest from "../services/api.js";
import useAuth from "../hooks/useAuth.js";

import "../styles/pages/ProfilePage.css";

function ProfilePage() {

  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [firstName, setFirstName] =
    useState(
      user?.firstName || ""
    );

  const [lastName, setLastName] =
    useState(
      user?.lastName || ""
    );

  const [profilePicture, setProfilePicture] =
    useState(
      user?.profilePictureUrl || null
    );

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [house, setHouse] =
    useState("");

  const [road, setRoad] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [area, setArea] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [hasAddress, setHasAddress] =
    useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [uploadingPicture, setUploadingPicture] =
    useState(false);

  const [savingAddress, setSavingAddress] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  useEffect(() => {

    async function loadProfile() {

      setLoading(true);
      setError("");

      try {

        const profileResponse =
          await apiRequest(
            "/api/users/me",
            {
              method: "GET",
            }
          );

        updateUser(
          profileResponse
        );

        setFirstName(
          profileResponse.firstName
        );

        setLastName(
          profileResponse.lastName
        );

        setProfilePicture(
          profileResponse.profilePictureUrl
        );

        try {

          const addressResponse =
            await apiRequest(
              "/api/addresses/me",
              {
                method: "GET",
              }
            );

          setHasAddress(true);

          setHouse(
            addressResponse.house
          );

          setRoad(
            addressResponse.road
          );

          setBlock(
            addressResponse.block
          );

          setArea(
            addressResponse.area || ""
          );

          setPhoneNumber(
            addressResponse.phoneNumber
          );

        } catch (error) {

          if (error.status === 404) {

            setHasAddress(false);

          } else {

            throw error;
          }
        }

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);
      }
    }

    loadProfile();

  }, []);

  async function handleProfileSubmit(
    event
  ) {

    event.preventDefault();

    setSavingProfile(true);
    setError("");
    setMessage("");

    try {

      const response =
        await apiRequest(
          "/api/users/me",
          {
            method: "PUT",

            body: JSON.stringify({
              firstName,
              lastName,
            }),
          }
        );

      updateUser(
        response
      );

      setMessage(
        "Profile updated successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSavingProfile(false);
    }
  }

  function handleFileChange(
    event
  ) {

    const file =
      event.target.files[0];

    setSelectedFile(
      file || null
    );
  }

  async function handleProfilePictureUpload() {

    if (!selectedFile) {

      setError(
        "Select an image first."
      );

      return;
    }

    setUploadingPicture(true);
    setError("");
    setMessage("");

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response =
        await apiRequest(
          "/api/users/me/profile-picture",
          {
            method: "POST",
            body: formData,
          }
        );

      updateUser(
        response
      );

      setProfilePicture(
        response.profilePictureUrl
      );

      setSelectedFile(null);

      setMessage(
        "Profile picture updated successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUploadingPicture(false);
    }
  }

  async function handleAddressSubmit(
    event
  ) {

    event.preventDefault();

    setSavingAddress(true);
    setError("");
    setMessage("");

    try {

      const requestBody = {
        house,
        road,
        block,
        area,
        phoneNumber,
      };

      if (hasAddress) {

        await apiRequest(
          "/api/addresses/me",
          {
            method: "PUT",

            body: JSON.stringify(
              requestBody
            ),
          }
        );

      } else {

        await apiRequest(
          "/api/addresses/me",
          {
            method: "POST",

            body: JSON.stringify(
              requestBody
            ),
          }
        );

        setHasAddress(true);
      }

      setMessage(
        "Delivery address saved successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSavingAddress(false);
    }
  }

  async function handlePasswordSubmit(
    event
  ) {

    event.preventDefault();

    setPasswordError("");

    if (
      newPassword !==
      confirmPassword
    ) {

      setPasswordError(
        "New passwords do not match."
      );

      return;
    }

    setChangingPassword(true);

    try {

      await apiRequest(
        "/api/users/me/password",
        {
          method: "PATCH",

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      logout();

      navigate(
        "/login",
        {
          state: {
            message:
              "Password changed successfully. Please login again.",
          },
        }
      );

    } catch (error) {

      setPasswordError(
        error.message
      );

    } finally {

      setChangingPassword(false);
    }
  }

  if (loading) {

    return (
      <section className="profile-page">

        <p className="profile-message">
          Loading profile...
        </p>

      </section>
    );
  }

  return (
    <section className="profile-page">

      <div className="profile-header">

        <h1 className="page-title">
          My Profile
        </h1>

        <p className="page-description">
          Manage your account and delivery information.
        </p>

      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-layout">

        <div className="profile-main">

          <section className="profile-section">

            <h2>
              Profile Information
            </h2>

            <div className="profile-picture-section">

              <div className="profile-picture-container">

                {profilePicture ? (

                  <img
                    className="profile-picture"
                    src={profilePicture}
                    alt="Profile"
                  />

                ) : (

                  <div className="profile-picture-placeholder">

                    {firstName
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                )}

              </div>

              <div className="profile-picture-actions">

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={
                    handleFileChange
                  }
                />

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    handleProfilePictureUpload
                  }
                  disabled={
                    uploadingPicture ||
                    !selectedFile
                  }
                >
                  {uploadingPicture
                    ? "Uploading..."
                    : "Upload Picture"
                  }
                </button>

              </div>

            </div>

            <form
              onSubmit={
                handleProfileSubmit
              }
            >

              <div className="profile-form-grid">

                <div className="form-group">

                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    maxLength="50"
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    maxLength="50"
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              <button
                className="profile-save-button"
                type="submit"
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Saving..."
                  : "Save Profile"
                }
              </button>

            </form>

          </section>

          <section className="profile-section">

            <h2>
              Delivery Address
            </h2>

            <form
              onSubmit={
                handleAddressSubmit
              }
            >

              <div className="profile-form-grid">

                <div className="form-group">

                  <label htmlFor="house">
                    House
                  </label>

                  <input
                    id="house"
                    type="text"
                    value={house}
                    maxLength="20"
                    onChange={(event) =>
                      setHouse(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="road">
                    Road
                  </label>

                  <input
                    id="road"
                    type="text"
                    value={road}
                    maxLength="20"
                    onChange={(event) =>
                      setRoad(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="block">
                    Block
                  </label>

                  <input
                    id="block"
                    type="text"
                    value={block}
                    maxLength="20"
                    onChange={(event) =>
                      setBlock(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="area">
                    Area
                  </label>

                  <input
                    id="area"
                    type="text"
                    value={area}
                    maxLength="100"
                    onChange={(event) =>
                      setArea(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-group profile-full-width">

                  <label htmlFor="phoneNumber">
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    maxLength="20"
                    placeholder="+97333123456"
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              <button
                className="profile-save-button"
                type="submit"
                disabled={savingAddress}
              >
                {savingAddress
                  ? "Saving..."
                  : hasAddress
                    ? "Update Address"
                    : "Save Address"
                }
              </button>

            </form>

          </section>

          <section className="profile-section">

            <h2>
              Change Password
            </h2>

            {passwordError && (
              <div className="error-message">
                {passwordError}
              </div>
            )}

            <form
              onSubmit={
                handlePasswordSubmit
              }
            >

              <div className="form-group">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  minLength="8"
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  minLength="8"
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <button
                className="profile-save-button"
                type="submit"
                disabled={
                  changingPassword
                }
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"
                }
              </button>

            </form>

          </section>

        </div>

        <aside className="account-details">

          <h2>
            Account
          </h2>

          <div className="account-detail">

            <span>
              Email
            </span>

            <strong>
              {user?.email}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Role
            </span>

            <strong>
              {user?.role}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Status
            </span>

            <strong>
              {user?.status}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Email Verification
            </span>

            <strong>
              {user?.verified
                ? "Verified"
                : "Not Verified"
              }
            </strong>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default ProfilePage;