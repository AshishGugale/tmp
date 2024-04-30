import React from "react";
import { Layout, Menu } from "antd";
import { SiderStyle } from "../styles/Styles";
import {
  BarChartOutlined,
  CloudOutlined,
  UploadOutlined,
  UnorderedListOutlined,
  CarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Sider = Layout.Sider;

const SiderFunction = () => {
  const queryString = window.location.pathname;
  let selected;
  if (queryString.length == 1) selected = "1";
  else if (queryString[1] == "g") selected = "2";
  const vals = ["Dashboard", "Get Rides"];
  const items = [UnorderedListOutlined, CarFilled].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `${vals[index]}`,
    onClick: () => handleNavigate(vals[index]),
  }));
  const navigate = useNavigate();
  function handleNavigate(path) {
    if (path === "Dashboard") {
      navigate("/");
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
        defaultSelectedKeys={[selected]}
        items={items}
        style={{
          marginTop: "15px",
        }}
      />
    </Sider>
  );
};

export default SiderFunction;
