import React, { useEffect } from "react";
import axios from "axios";
import Layout from "../Components/Layout";
const HomePage = () => {
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getUserData",
        {
          userId: localStorage.getItem("userId"), // replace with actual method of getting user ID from database
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1>Home Page</h1>
    </Layout>
  );
};

export default HomePage;