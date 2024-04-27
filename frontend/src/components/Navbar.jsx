import React, { useEffect, useState } from "react";
import {
  ThunderboltFilled,
  LinkedinFilled,
  GithubFilled,
  HomeFilled,
  UserOutlined,
} from "@ant-design/icons";
import { NavbarStyle } from "../styles/Styles";
import { Layout, theme, Button, notification, Tooltip} from "antd";
import {
  checkValidUser,
  walletAddress,
  CreateUserOnChain,
  web3Object,
} from "../integration/Scripts.js";

const Header = Layout.Header;
const contractInstance = web3Object.contractInstance;
const Navbar = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [isValid, setIsValid] = useState(false);
  const [userCreation, setUserCreation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      setIsValid(await checkValidUser());
    }
    check();
  }, [userCreation]);

  const createAccountHandler = async () => {
    try {
      setLoading(true);
      const tx = await CreateUserOnChain();
      if (tx) throw tx;
      api.success({
        message: "Request sent successfully",
        description: `Request for user account creation successfully submitted and is in queue!!`,
        className: "custom-class",
        style: {
          width: 600,
        },
        duration: "1.5",
      });
      contractInstance.on("UserCreated", (from, to, _amount, event) => {
        if (from === walletAddress) {
          setLoading(false);
          setUserCreation(!userCreation);
        }
      });
    } catch (err) {
      let response;
      if (err.revert) response = err.revert.args;
      else response = "Error occured in obtaining Metamask signature!";
      api.error({
        message: "Error in user account creation",
        description: response,
        className: "custom-class",
        style: {
          width: 600,
        },
        duration: "100",
      });
    }
  };

  return (
    <Header style={NavbarStyle(colorBgContainer, borderRadiusLG)}>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginLeft: "20px", fontWeight: "bold" }}>
          SunStream <ThunderboltFilled style={{ color: "blue" }} />
        </div>
        <div style={{ display: "flex", gap: "20px", margin: "0px 20px" }}>
          {isValid ? (
            <Tooltip title={walletAddress} placement="left">
              <UserOutlined />
            </Tooltip>
          ) : loading ? (
            <Button type="primary" style={{ alignSelf: "center" }}>
              User Creation is Progress!!
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ alignSelf: "center" }}
              onClick={createAccountHandler}
            >
              Create User
            </Button>
          )}
          <a href="/" target="blank" style={{ color: "inherit" }}>
            <HomeFilled />
          </a>
          <a href="https://www.linkedin.com/in/ashish-gugale-525b77227/" target="blank">
            <LinkedinFilled />
          </a>
          <a
            href="https://github.com/AshishGugale/SunStream"
            target="blank"
            style={{ color: "inherit" }}
          >
            <GithubFilled />
          </a>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
