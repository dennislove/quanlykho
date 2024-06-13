import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { database, ref, onValue } from "../../App";
import { useEffect, useState } from "react";

const List = ({ type }) => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      const nodeRef = ref(database, type); // Đường dẫn đến node Products trong Firebase Realtime Database

      onValue(nodeRef, (snapshot) => {
        if (snapshot.exists()) {
          const response = snapshot.val();
          // Xử lý dữ liệu ở đây, ví dụ:
          const productKeys = Object.keys(response); // Lấy mảng các key của object products
          const lastProductKey = productKeys[productKeys.length - 1]; // Lấy key của phần tử cuối cùng
          const lastProducts = response[lastProductKey];
          setData(Object.values(lastProducts));
        }
      });
    };

    fetchData();

    // Clean up function if needed
    return () => {
      // Clean up code if needed
    };
  }, []); // Chỉ gọi một lần khi component mount
  console.log(data);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Mã sản phẩm</TableCell>
            <TableCell className="tableCell">Tên sản phẩm</TableCell>
            <TableCell className="tableCell">Loại</TableCell>
            <TableCell className="tableCell">Đơn giá</TableCell>
            <TableCell className="tableCell">Số lượng</TableCell>
            <TableCell className="tableCell">Đơn vị</TableCell>
            <TableCell className="tableCell">Người nhập</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow key={row.nameID}>
                <TableCell className="tableCell">{row.nameID}</TableCell>
                <TableCell className="tableCell">{row.descriptions}</TableCell>
                <TableCell className="tableCell">{row.title}</TableCell>
                <TableCell className="tableCell">{row.price}</TableCell>
                <TableCell className="tableCell">{row.quantity}</TableCell>
                <TableCell className="tableCell">{row.unit}</TableCell>
                <TableCell className="tableCell">{row.user}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
