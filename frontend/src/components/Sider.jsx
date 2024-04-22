import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { SiderStyle } from "../styles/Styles";
import {
  BarChartOutlined,
  CloudOutlined,
  UploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Sider = Layout.Sider;

const SiderFunction = () => {
  const vals = ["Dashboard", "Add Listing", "Statistics", "My Data"];
  const items = [
    UnorderedListOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `${vals[index]}`,
    onClick: () => handleNavigate(vals[index]),
  }));
  const navigate = useNavigate();
  function handleNavigate(path) {
    if (path === "Dashboard") {
      navigate('/');
      return;
    }
    const pthLower = path.split(" ").filter(Boolean).join("").toLowerCase();
    navigate(`/${pthLower}`);
  }

  return (
    <Sider style={SiderStyle}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{
          marginTop: "15px",
        }}
      />
    </Sider>
  );
};

export default SiderFunction;
