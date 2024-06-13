import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import "./dashboard.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const userRole = currentUser ? currentUser.role : null; // Lấy userRole từ currentUser

  return (
    <div>
      <h1>Dashboard</h1>
      {/* {userRole === "Admin" && (
        <div>
          <h2>Admin Functions</h2>
          <ul>
            <li>Manage Accounts</li>
            <li>Manage Products</li>
          </ul>
        </div>
      )}
      {userRole === "Nhân viên nhập" && (
        <div>
          <h2>Nhân viên nhập Functions</h2>
          <ul>
            <li>Manage Products</li>
          </ul>
        </div>
      )}
      {!userRole && <p>Unauthorized access</p>} */}
      <div className="home">
        <div className="homeContainer">
          <div className="widgets">
            <Widget type="Products" />
            <Widget type="SessionsExp" />
            <Widget type="SessionsImp" />
            <Widget type="products_runout" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Danh sách sản phẩm vừa nhập</div>
            <Table type={"SessionsImp"} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Danh sách sản phẩm vừa xuất</div>
            <Table type={"SessionsExp"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
