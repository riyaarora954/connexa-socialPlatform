import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external";
import { connect } from "react-redux";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      console.log("LOGIN PAYLOAD", user);
      const response = await clientServer.post(`/login`, {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({ message: "Token not provided" });
      }
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const request = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );
      thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const getConnectionRequests = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/getConnectionRequests", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          params: {
            token: user.token,
            requestId: user.connectionId,
            action_type: user.action,
          },
        }
      );
      console.log(response);
      thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// authAction.js
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("No token");

    try {
      const response = await clientServer.get(`/user/getUser?token=${token}`);
      return response.data; // contains userId.name etc.
    } catch (err) {
      return thunkAPI.rejectWithValue("Invalid token");
    }
  }
);
