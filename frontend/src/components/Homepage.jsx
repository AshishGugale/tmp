import React, { useEffect, useState } from "react";
import { getLogs, walletAddress } from "../integration/scripts";

const Homepage = () => {
  const [data, setData] = useState([]);

  async function getUserActivity() {
    let dataObtained = await getLogs("UserCreated(address)", []);
    setData(dataObtained);
  }

  useEffect(() => {
    getUserActivity();
  }, []);

  return (
    <>
      <p>User Activity for: {walletAddress}</p>
      <ul>
        {data.length === 0 && <p>Loading User Activity...</p>}
        {data.length > 0 && data.map((dataObj) => (
          <li key = {dataObj.transactionHash}>{dataObj.address}</li>
        ))}
        {data.length === 0 && data !== null && "No Activity!!"}
      </ul>
    </>
  );
};

export default Homepage;
