import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Connexa
        </h1>

        <div className={styles.profileContainer}>
          {authState.profileFetched && authState.user?.userId?.name && (
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                fontSize: "1.2rem",
              }}
            >
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                Profile
              </p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Logout
              </p>
            </div>
          )}
        </div>

        <div className={styles.NavBarOptionContainer}>
          {!authState.profileFetched && (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              Be a part
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
