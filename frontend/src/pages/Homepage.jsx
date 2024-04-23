import React from "react";
import Navbar from "../components/Navbar.jsx";
import SiderFunction from "../components/Sider.jsx";
import Footer from "../components/Footer.jsx";

import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const Homepage = () => {
  return (
    <Layout hasSider>
      <SiderFunction />
      <Layout
        style={{
          marginLeft: 200,
          marginTop: -10,
          marginRight: -10,
        }}
      >
        <Navbar />
        <Outlet />
        <Footer />
      </Layout>
    </Layout>
  );
};
export default Homepage;
