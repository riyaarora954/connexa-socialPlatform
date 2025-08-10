import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptConnection,
  getMyConnectionRequests,
  getAboutUser,
  getAllUsers,
} from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const authState = useSelector((state) => state.auth);
  const isTokenThere = useSelector((state) => state.auth.isTokenThere);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

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

  useEffect(() => {
    if (authState.connectionRequest.length !== 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!authState.loggedIn && !token) {
      router.replace("/login");
    }
  }, [authState.loggedIn]);

  const pendingConnections = authState.connectionRequest.filter(
    (connection) => connection.status_accepted === false
  );

  const acceptedConnections = authState.connectionRequest.filter(
    (connection) => connection.status_accepted === true
  );

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          {authState.connectionRequest.length === 0 && (
            <h1>No Connection Requests</h1>
          )}

          {/* My Connections section */}
          {pendingConnections.length > 0 && (
            <>
              <h1>My Connections</h1>
              {pendingConnections.map((user, index) => (
                <div
                  key={index}
                  className={styles.userCard}
                  onClick={() =>
                    router.push(`/view_profile/${user.userId.username}`)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          acceptConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                            action: "accept",
                          })
                        );
                      }}
                      className={styles.connectedButton}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* My Network section */}
          {acceptedConnections.length > 0 && (
            <>
              <h4>My Network</h4>
              {acceptedConnections.map((user, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <div className={styles.profilePicture}>
                    <img
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
