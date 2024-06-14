import { useEffect, useState } from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { database, ref, onValue } from "../../App"; // Đảm bảo import đúng từ firebase

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(0); // Sử dụng state để lưu trữ giá trị amount từ Firebase
  const [diff, setDiff] = useState(0); // Ví dụ sử dụng state cho diff, nếu có sử dụng thay đổi số phần trăm

  let data;
  let url;
  let unit;

  useEffect(() => {
    const fetchData = () => {
      const nodeRef = ref(
        database,
        type === "products_runout" ? "Products" : type
      ); // Đường dẫn đến node Products trong Firebase Realtime Database

      onValue(nodeRef, (snapshot) => {
        if (snapshot.exists()) {
          const response = snapshot.val();
          // Xử lý dữ liệu ở đây, ví dụ:

          if (type === "Products") {
            let totalQuantity = Object.keys(response).length;

            // Cập nhật state amount với tổng quantity tính được
            setAmount(totalQuantity);
          }

          if (type === "SessionsExp") {
            let totalQuantity = Object.keys(response).length;

            // Cập nhật state amount với tổng quantity tính được
            setAmount(totalQuantity);
          }

          if (type === "SessionsImp") {
            let totalQuantity = Object.keys(response).length;

            // Cập nhật state amount với tổng quantity tính được
            setAmount(totalQuantity);
          }

          if (type === "products_runout") {
            let totalQuantity = 0;
            Object.keys(response).forEach((productId) => {
              if (response[productId].quantity < 11) {
                totalQuantity++;
              }
            });

            // Cập nhật state amount với tổng quantity tính được
            setAmount(totalQuantity);
          }
        }
      });
    };

    fetchData();

    // Clean up function if needed
    return () => {
      // Clean up code if needed
    };
  }, []); // Chỉ gọi một lần khi component mount

  switch (type) {
    case "Products":
      data = {
        title: "TỔNG SỐ LOẠI SẢN PHẨM",
        link: "Xem tất cả các sản phẩm",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      url = "/product";
      unit = "loại sản phẩm";
      break;
    case "SessionsExp":
      data = {
        title: "TỔNG SỐ PHIẾU XUẤT",
        link: "Xem tất cả các phiếu xuất",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      url = "/";
      unit = "phiếu xuất";
      break;
    case "SessionsImp":
      data = {
        title: "TỔNG SỐ PHIẾU NHẬP",
        link: "Xem tất cả các phiếu nhập",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      url = "/";
      unit = "phiếu nhập";
      break;
    case "products_runout":
      data = {
        title: "LOẠI SẢN PHẨM SẮP HẾT",
        link: "Xem chi tiết",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      url = "/";
      unit = "loại sản phẩm";
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {amount} {unit} {/* Hiển thị số lượng sản phẩm từ Firebase */}
        </span>
        <a href={url} className="link">
          {data.link}
        </a>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
