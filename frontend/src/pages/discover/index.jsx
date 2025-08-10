import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import { style } from "@mui/system";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
export default function DiscoverPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const isTokenThere = useSelector((state) => state.auth.isTokenThere);
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
    const token = localStorage.getItem("token");
    if (!authState.loggedIn && !token) {
      router.replace("/login");
    }
  }, [authState.loggedIn]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1 className={styles.pageTitle}>Discover</h1>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    key={user._id}
                    className={styles.userCard}
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                  >
                    <img
                      className={styles.userCard__image}
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                    <div className={styles.userCard__info}>
                      <h1>{user.userId.name}</h1>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
