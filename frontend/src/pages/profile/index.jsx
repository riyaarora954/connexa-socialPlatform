import { getAboutUser } from "@/config/redux/action/authAction";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { getAllUsers } from "@/config/redux/action/authAction";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const isTokenThere = useSelector((state) => state.auth.isTokenThere);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const [educationInput, setEducationInput] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [authState.isTokenThere]);
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationInput({ ...educationInput, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);
  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);
  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };
  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currPost: userProfile.currPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <h1> CONNEXA</h1>

              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                type="file"
                hidden
                id="profilePictureUpload"
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
              />
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>

            <div
              className={styles.profileContainer__details}
              style={{
                marginTop: "4rem",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",

                    alignItems: "start",
                  }}
                >
                  <input
                    className={styles.nameEdit}
                    type="text"
                    style={{
                      fontSize: "1.5rem",
                      width: "50%",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                    value={userProfile.userId.name}
                    onChange={(e) => {
                      setUserProfile({
                        ...userProfile,
                        userId: {
                          ...userProfile.userId,
                          name: e.target.value,
                        },
                      });
                    }}
                  />

                  <p style={{ color: "grey", margin: 0 }}>
                    &nbsp;@{userProfile.userId.username}
                  </p>
                </div>

                <div>
                  <textarea
                    placeholder="Add Bio"
                    value={userProfile.bio}
                    onChange={(e) => {
                      setUserProfile({ ...userProfile, bio: e.target.value });
                    }}
                    rows={Math.max(2, Math.ceil(userProfile.bio.length / 80))}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      paddingBottom: "1rem",
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ marginBottom: "12px" }}>Recent Activity</h3>
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post._id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    {post.media !== "" && (
                      <img
                        src={`${BASE_URL}/${post.media}`}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <p style={{ margin: 0 }}>{post.body}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "grey" }}>No recent activity</p>
              )}
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years} years</p>
                  </div>
                ))}
                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen("work");
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>
            <div className={styles.workHistory}>
              <h4>Education</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.education?.map((edu, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {edu.school} - {edu.degree}
                    </p>
                    <p>{edu.fieldOfStudy}</p>
                  </div>
                ))}
                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen("education");
                  }}
                >
                  Add Education
                </button>
              </div>
            </div>

            {userProfile != authState.user && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}
        {isModalOpen === "work" && (
          <div
            onClick={() => {
              setIsModalOpen(null);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <h2>Add Work Experience</h2>
              <input
                className={styles.inputField}
                type="text"
                placeholder="Company"
                name="company"
                onChange={handleWorkInputChange}
                required
              />
              <input
                className={styles.inputField}
                type="text"
                name="position"
                placeholder="Position"
                onChange={handleWorkInputChange}
                required
              />
              <input
                className={styles.inputField}
                type="number"
                name="years"
                placeholder="Years"
                onChange={handleWorkInputChange}
                required
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(null);
                }}
              >
                Add Work
              </div>
            </div>
          </div>
        )}
        {isModalOpen === "education" && (
          <div
            onClick={() => {
              setIsModalOpen(null);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <h2>Add Education</h2>
              <input
                className={styles.inputField}
                type="text"
                placeholder="School"
                name="school"
                onChange={handleEducationInputChange}
                required
              />
              <input
                className={styles.inputField}
                type="text"
                name="degree"
                placeholder="Degree"
                onChange={handleEducationInputChange}
                required
              />
              <input
                className={styles.inputField}
                type="text"
                name="fieldOfStudy"
                placeholder="Field of Study"
                onChange={handleEducationInputChange}
                required
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [
                      ...(userProfile.education || []),
                      educationInput,
                    ],
                  });
                  setIsModalOpen(null);
                }}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
