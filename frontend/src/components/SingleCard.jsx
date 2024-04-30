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
  web3Object,
  getFloatLatitudeEndOnChain,
  getFloatLatitudeStartOnChain,
  getFloatLongtitudeEndOnChain,
  getFloatLongtitudeStartOnChain,
  CreateProposalOnChain,
} from "../integration/Scripts.js";
import { ethers } from "ethers";

const { Meta } = Card;
function SingleCard({ prop1 }) {
  // /**
  //  * ANT-D inherited consts
  //  * Constants for styling, obtained from ant-d
  //  * Notification setters, contextHolder to be added in component root to load notifs
  //  */
  const floatId = parseInt(prop1.topics[1], 16);
  const fare = parseInt(prop1.topics[2], 16) / 1e15;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [latStart, setlatStart] = useState(0);
  const [latEnd, setlatEnd] = useState(0);
  const [longStart, setlongStart] = useState(0);
  const [longEnd, setlongEnd] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Initial Params for the listing and price fetchers
   * price - Listing's current price
   * changed - Used as dependency for the useEffect fetching the listing price, changes when the event listener hears a BidSuccessful event for this Listing
   */
  const [price, setPrice] = useState(fare);
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
   * floatId of the current listing
   */

  /**
   * The bid handler forms onChange event
   * @param {*} event Change event
   */

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setlatEnd((Number(await getFloatLatitudeEndOnChain(floatId))/1000000).toString());
      setlatStart((Number(await getFloatLatitudeStartOnChain(floatId))/1000000).toString());
      setlongEnd((Number(await getFloatLongtitudeEndOnChain(floatId))/1000000).toString());
      setlongStart((Number(await getFloatLongtitudeStartOnChain(floatId))/1000000).toString());
      setLoading(false);
    }
    getData();
  }, []);

  async function proposalCreateHandler() {
    const tx = await CreateProposalOnChain(floatId);
    if (tx) console.log(tx);
  }

  useEffect(() => {
    const listener = (from, to, amount, event) => {
      // console.log(from, to, amount, event);
      if (Number(to) === floatId) {
        
      }
    };
    web3Object.contractInstance.on("ProposalCreated", listener);
    return () => {
      web3Object.contractInstance.off("ProposalCreated", listener);
    };
  }, []);

  /**
   * Function incharge of handling the bid
   * Also responsible for changing the stage for Steps
   * Error handling is passed on to this by the core functions
   */
  async function handleBid() {}
  return (
    <>
      {contextHolder}
      {loading ? (
        ""
      ) : (
        <Card
          style={{
            width: "33rem",
          }}
          hoverable
          // cover={<img alt="example" src="https://i.imgur.com/aF4OnAY.jpg" />}
          actions={[
            <Tooltip placement="bottom" title="Accept Ride">
              <DollarTwoTone
                key="Bid"
                onClick={() => proposalCreateHandler()}
              />
            </Tooltip>,
          ]}
        >
          <Skeleton loading={loading} avatar active>
            <Meta
              title={`Float ID: ${floatId}`}
              description=<div>
                <div>Fare: {price}</div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>
                      Initial latitude:{" "}
                      {latStart !== 0 ? latStart : "Fetching..."}
                    </p>
                    <p>
                      Initial longtitude:{" "}
                      {longStart !== 0 ? longStart : "Fetching..."}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>
                      Final latitude: {latEnd !== 0 ? latEnd : "Fetching..."}
                    </p>
                    <p>
                      Final longtitude:{" "}
                      {longEnd !== 0 ? longEnd : "Fetching..."}
                    </p>
                  </div>
                </div>
              </div>
            />
          </Skeleton>
        </Card>
      )}
    </>
  );
}
export default SingleCard;
