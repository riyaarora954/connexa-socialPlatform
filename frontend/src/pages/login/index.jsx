import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userLoginMethod) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, password, email, name }));
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <form className={styles.inputContainers} onSubmit={handleSubmit}>
              {!userLoginMethod && (
                <div className={styles.inputRows}>
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <input
                className={styles.inputField}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
              <input
                className={styles.inputField}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className={styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </button>
            </form>
          </div>

          <div className={styles.cardContainer__right}>
            {userLoginMethod ? (
              <p>Don't have an account?</p>
            ) : (
              <p>Already have an account?</p>
            )}
            <div
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
