import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  theme,
  Layout,
  Button,
  notification,
  Steps,
  Tooltip,
} from "antd";
import {
  CreateListingOnChain,
  web3Object,
  walletAddress,
} from "../integration/Scripts";
import { useNavigate } from "react-router-dom";
import {
  SolutionOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
const Content = Layout.Content;

const App = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [price, setPrice] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const [currState, setCurrState] = useState(-1);
  const [status, setCurrStatus] = useState("wait");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const listener = (from, to, _amount, event) => {
      if (from === walletAddress) {
        setCurrState(2);
        api.success({
          message: "Successful",
          description: "The listing has been done!!",
          placement: "topRight",
        });
        setTimeout(() => {
          setCurrState(-1);
          setCurrStatus("wait");
          setWorking(false);
        }, 4000);
      }
    };
    web3Object.contractInstance.on("ItemCreated", listener);
    return () => {
      web3Object.contractInstance.off("ItemCreated", listener);
    };
  }, []);
  async function handleCreateListing() {
    if (price === 0) return;
    setWorking(true);
    setCurrState(0);
    CreateListingOnChain(price * 1000000)
      .then((res) => {
        setCurrState(1);
        if (res) throw res;
      })
      .catch((err) => {
        let message;
        if (err.revert) message = err.revert.message;
        else message = "Metamask refused the transaction!!";
        setCurrState("error");
        api.error({
          message: `Error`,
          description: message,
          placement: "topRight",
        });
        setCurrState(-1);
        setCurrStatus("finish");
      })
      .finally(() => {
        setPrice(0);
      });
  }

  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value);
    setPrice(newPrice);
  };
  return (
    <>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          margin: "20px 16px 0",
          overflow: "initial",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          alignItems: "center",
        }}
      >
        {contextHolder}
        {working ? (
          <Steps
            style={{
              marginTop: "20px",
              borderRadius: borderRadiusLG,
            }}
            size="small"
            current={currState}
            status={status}
            type="navigation"
            items={[
              {
                icon: (
                  <Tooltip title="Authorized">
                    <SolutionOutlined />
                  </Tooltip>
                ),
              },
              {
                icon: (
                  <Tooltip title="Submitted">
                    <DatabaseOutlined />
                  </Tooltip>
                ),
              },
              {
                icon: (
                  <Tooltip title="Listed">
                    <CheckCircleOutlined />
                  </Tooltip>
                ),
              },
            ]}
          />
        ) : (
          ""
        )}
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          labelWrap
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            marginTop: "50px",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleCreateListing}
          autoComplete="off"
        >
          <Form.Item
            label="Listing Price (In Finney)"
            name="ListingPrice"
            rules={[
              {
                message: "Please enter the listing value!",
              },
            ]}
          >
            <Input type="number" onChange={handlePriceChange} value={price} />
          </Form.Item>
          <Form.Item>
            <p>Listing Price (In Eth): {price / 1000}</p>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};
export default App;
