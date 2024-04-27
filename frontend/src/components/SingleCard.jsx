import React, { useEffect, useState } from "react";
import {
  SlidersTwoTone,
  ClockCircleTwoTone,
  DollarTwoTone,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  SolutionOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Skeleton,
  notification,
  Tooltip,
  Form,
  Input,
  theme,
  Steps,
} from "antd";
import {
  CreateOfferOnChain,
  web3Object,
  getPrice,
} from "../integration/Scripts.js";
import { ethers } from "ethers";

const { Meta } = Card;
function SingleCard({ prop1 }) {

  /**
   * ANT-D inherited consts 
   * Constants for styling, obtained from ant-d
   * Notification setters, contextHolder to be added in component root to load notifs
   */
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();

  /**
   * Initial Params for the listing and price fetchers
   * price - Listing's current price
   * changed - Used as dependency for the useEffect fetching the listing price, changes when the event listener hears a BidSuccessful event for this Listing
   */
  const [price, setPrice] = useState(0);
  const [changed, setChanged] = useState(false);

  /**
   * Variables that add bid addition functionality
   * showBid - When true, opens up the bid form
   * bidPrice - The variable that stores the current value of the Input
   */
  const [showBid, setShowBid] = useState(false);
  const [bidPrice, setBidPrice] = useState(0);
  
  /**
   * Variables that maintain the current state of Steps
   * currState - Current step in the steps (0-indexed)
   * status - Used for a more graceful error experience
   * working - When true, displays the steps
   */
  const [currState, setCurrState] = useState(-1);
  const [status, setCurrStatus] = useState("wait");
  const [working, setWorking] = useState(false);
  
  /**
   * ListingId of the current listing
   */
  const ListingId = parseInt(prop1.topics[2], 16); 

  /**
   * The bid handler forms onChange event
   * @param {*} event Change event
   */
  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value);
    setBidPrice(newPrice);
  };

  /**
   * Bid successful event listener that is incharge of changing the dependency of price fetcher once a new price state is reached on chain
   * Also removes the event listener on unmounting
   */
  useEffect(() => {
    const listener = (from, to, _amount, event) => {
      if (event.log.topics[2] == prop1.topics[2]) {
        setCurrState(2);
        api.success({
          message: "Successful",
          description: "The Offer has been accepted!!",
          placement: "topRight",
        });
        setTimeout(() => {
          setCurrState(-1);
          setCurrStatus("wait");
          setWorking(false);
          setShowBid(false);
        }, 4000);
        setChanged(!changed);
      }
    };
    web3Object.contractInstance.on("BidSuccessful", listener);
    return () => {
      web3Object.contractInstance.off("BidSuccessful", listener);
    };
  }, []);

  /**
   * useEffect to retrieve the current price for the listing
   * Dependency array changed by the event listener on hearing a BidSuccessful event for this listing
   */
  useEffect(() => {
    async function retrievePrice() {
      const price = await getPrice(ListingId);
      setPrice(ethers.formatEther(price));
    }
    retrievePrice();
  }, [changed]);

  /**
   * Function incharge of handling the bid  
   * Also responsible for changing the stage for Steps  
   * Error handling is passed on to this by the core functions
   */
  async function handleBid() {
    if (bidPrice === 0) return;
    setWorking(true);
    setCurrState(0);
    CreateOfferOnChain(parseInt(ListingId, 16), bidPrice * 1e15)
      .then((res) => {
        setCurrState(1);
        if (res) throw err;
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
        setBidPrice(0);
      });
  }

  return (
    <>
      {contextHolder}
      {showBid ? (
        <Card
          style={{
            width: "33rem",
          }}
          hoverable
          // cover={<img alt="example" src="https://i.imgur.com/aF4OnAY.jpg" />}
          actions={[
            <Tooltip placement="bottom" title="Bid">
              <CheckOutlined key="Bid" onClick={handleBid} />
            </Tooltip>,
            <Tooltip placement="bottom" title="Close">
              <CloseOutlined key="Close" onClick={() => setShowBid(false)} />
            </Tooltip>,
          ]}
        >
          <Skeleton loading={false} avatar active>
            <Meta
              title={`Submit bid on: ${ListingId}`}
              description={`Current Price: ${price}`}
            />
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
              onFinish={() => alert("Submitted")}
              autoComplete="off"
            >
              <Form.Item
                label="Bid value (In Finney)"
                name="BidPrice"
                rules={[
                  {
                    message: "Please enter the bid value!",
                  },
                ]}
              >
                <Input
                  type="number"
                  value={bidPrice}
                  onChange={handlePriceChange}
                />
              </Form.Item>
              <Form.Item>
                <p>Bid value (In Eth): {bidPrice / 1000}</p>
              </Form.Item>
            </Form>
          </Skeleton>
          {working ? (
            <Steps
              style={{
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
        </Card>
      ) : (
        <Card
          style={{
            width: "33rem",
          }}
          hoverable
          // cover={<img alt="example" src="https://i.imgur.com/aF4OnAY.jpg" />}
          actions={[
            <Tooltip placement="bottom" title="Bid">
              <DollarTwoTone key="Bid" onClick={() => setShowBid(true)} />
            </Tooltip>,
            <Tooltip placement="bottom" title="Deadline">
              <ClockCircleTwoTone key="Deadline" />
            </Tooltip>,
            <Tooltip placement="bottom" title="Activity">
              <SlidersTwoTone key="Activity" />
            </Tooltip>,
          ]}
        >
          <Skeleton loading={false} avatar active>
            <Meta
              avatar={<Avatar src="https://i.imgur.com/ww4Wa6O.jpg" />}
              title={`Listing ID: ${ListingId}`}
              description={`Current Price: ${price}`}
            />
          </Skeleton>
        </Card>
      )}
    </>
  );
}
export default SingleCard;
