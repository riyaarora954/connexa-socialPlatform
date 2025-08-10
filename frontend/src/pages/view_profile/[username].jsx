import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import { store } from "@/config/redux/store"; // ✅ Access latest state

import { getAboutUser } from "@/config/redux/action/authAction";
export default function viewProfilePage({ userProfile }) {
  const searchParams = useSearchParams();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const isTokenThere = useSelector((state) => state.auth.isTokenThere);
  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [authState.isTokenThere]);
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionRequests({ token: localStorage.getItem("token") })
    );
    await dispatch(
      getMyConnectionRequests({ token: localStorage.getItem("token") })
    );

    const updatedState = store.getState().auth;
    const targetUserId = userProfile.userId._id;

    const sentRequest = updatedState.connections.find(
      (conn) => conn.connectionId._id === targetUserId
    );
    const receivedRequest = updatedState.connectionRequest.find(
      (conn) => conn.userId._id === targetUserId
    );

    if (sentRequest) {
      setIsCurrentUserInConnection(true);
      if (sentRequest.status_accepted === false) {
        setIsConnectionNull(true); // pending
      } else if (sentRequest.status_accepted === true) {
        setIsConnectionNull(false); // connected
      }
    } else if (receivedRequest) {
      setIsCurrentUserInConnection(true);
      if (receivedRequest.status_accepted === false) {
        setIsConnectionNull(true); // pending (received)
      }
    } else {
      setIsCurrentUserInConnection(false); // not connected
      setIsConnectionNull(true);
    }
  };

  // ✅ Get user's posts based on route param
  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  // ✅ Run data fetching on first load
  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <h1>CONNEXA</h1>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>

          <div
            className={styles.profileContainer__details}
            style={{
              marginTop: "4rem",
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            {/* Bio Section */}
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2 style={{ margin: 0 }}>{userProfile.userId.name}</h2>
                <p style={{ color: "grey", margin: 0 }}>
                  @{userProfile.userId.username}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>
                    {isConnectionNull ? "Pending" : "Connected"}
                  </button>
                ) : (
                  <button
                    className={styles.connectButton}
                    onClick={async () => {
                      await dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          user_id: userProfile.userId._id,
                        })
                      );
                      await getUsersPost();
                    }}
                  >
                    Connect
                  </button>
                )}

                <div
                  onClick={async () => {
                    const response = await clientServer.get(
                      `/user/download_resume?id=${userProfile.userId._id}`
                    );
                    window.open(
                      `${BASE_URL}/${response.data.message}`,
                      "_blank"
                    );
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Download Icon */}
                  <svg
                    style={{ width: "1.2em" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </div>
              </div>

              <p style={{ marginTop: "8px", paddingBottom: "1rem" }}>
                {userProfile.bio}
              </p>
            </div>

            {/* Recent Activity Section */}
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
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

// ✅ SSR: Fetch profile data by username
export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );

  return { props: { userProfile: request.data.profile } };
}
