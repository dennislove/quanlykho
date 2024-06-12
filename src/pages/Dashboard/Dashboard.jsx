import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const userRole = currentUser ? currentUser.role : null; // Lấy userRole từ currentUser

  console.log("User data in Dashboard:", userRole);

  return (
    <div>
      <h1>Dashboard</h1>
      {userRole === "Admin" && (
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
      {!userRole && <p>Unauthorized access</p>}
    </div>
  );
};

export default Dashboard;
