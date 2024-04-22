import React, { useEffect, useState } from "react";
import {
  ThunderboltFilled,
  LinkedinFilled,
  GithubFilled,
  HomeFilled,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavbarStyle } from "../styles/Styles";
import { Layout, theme, Button, notification, Tooltip } from "antd";
import {
  checkValidUser,
  walletAddress,
  CreateUserOnChain,
} from "../integration/Scripts.js";

const Header = Layout.Header;

const Navbar = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [isValid, setIsValid] = useState(false);
  const [userCreation, setUserCreation] = useState(false);

  useEffect(() => {
    async function check() {
      setIsValid(await checkValidUser());
    }
    check();
  }, [userCreation]);

  const createAccountHandler = async () => {
    try {
      const tx = await CreateUserOnChain();
      api.success({
        message: "Request sent successfully",
        description: `Request for user account creation successfully submitted and is in queue!!`,
        className: "custom-class",
        style: {
          width: 600,
        },
        duration: "1.5",
      });
      setUserCreation(!userCreation);
    } catch (err) {
      console.log(err);
      api.error({
        message: "Error",
        description: `Error`,
        className: "custom-class",
        style: {
          width: 600,
        },
        duration: "5",
      });
    }
  };

  return (
    <Header style={NavbarStyle(colorBgContainer, borderRadiusLG)}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginLeft: "20px", fontWeight: "bold" }}>
          SunStream <ThunderboltFilled style={{ color: "blue" }} />
        </div>
        <div style={{ display: "flex", gap: "20px", margin: "0px 20px" }}>
          {isValid ? (
            <Tooltip title={walletAddress} placement="left">
              <UserOutlined />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              style={{ alignSelf: "center" }}
              onClick={createAccountHandler}
            >
              Create User
            </Button>
          )}
          <a href="" target="blank" style={{ color: 'inherit' }}>
            <HomeFilled />
          </a>
          <a href="" target="blank" style={{ color: 'inherit' }}>
            <InfoCircleOutlined />
          </a>
          <a href="" target="blank">
            <LinkedinFilled />
          </a>
          <a href="https://github.com/AshishGugale/SunStream" target="blank" style={{ color: 'inherit' }}>
            <GithubFilled />
          </a>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
