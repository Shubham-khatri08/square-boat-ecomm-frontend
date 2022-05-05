import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders`, config)
      .then((response) => {
        setOrders(response.data.data.orders);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Item Names</th>
            <th>User</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.orderItems[0].title}</td>
                <td>{order.user.name}</td>
                <td>₹{order.totalPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={5}>
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
