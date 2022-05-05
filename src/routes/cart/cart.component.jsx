import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CART_ADD_ITEM,
  CART_CLEAR_ITEMS,
  CART_REMOVE_ITEM,
} from "../../redux/actions/cartActions";

export default function Cart() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, []);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const totalPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const handleQty = (product, qty) => {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: product.product,
        title: product.title,
        description: product.description,
        price: product.price,
        qty: qty,
      },
    });
  };

  const handleDeleteItem = (id) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: id,
    });
  };

  const checkoutHandler = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          orderItems: cartItems,
          totalPrice,
          user: userInfo.user._id,
        },
        config
      )
      .then((response) => {
        if (response?.data?.status === "success") {
          handleShow();
        }
        dispatch({
          type: CART_CLEAR_ITEMS,
          payload: response.data,
        });
        localStorage.removeItem("cartItems");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {cartItems && cartItems.length ? (
            cartItems?.map((item, index) => (
              <>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>₹{item.price}</td>
                  <td>
                    {" "}
                    {item.qty > 1 && (
                      <span
                        onClick={() => {
                          handleQty(item, item.qty - 1);
                        }}
                      >
                        Less
                      </span>
                    )}{" "}
                    <span style={{ marginLeft: "5px", marginRight: "5px" }}>
                      {item.qty}{" "}
                    </span>
                    <span
                      onClick={() => {
                        handleQty(item, item.qty + 1);
                      }}
                    >
                      Add
                    </span>
                    <span
                      style={{ float: "right" }}
                      onClick={() => {
                        handleDeleteItem(item.product);
                      }}
                    >
                      Delete Item
                    </span>
                  </td>
                </tr>
              </>
            ))
          ) : (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={5}>
                No Data
              </td>
            </tr>
          )}
          {cartItems.length > 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "right" }}>
                Total Amount: ₹{totalPrice}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Button
        type="button"
        className="btn-block"
        disabled={cartItems.length === 0}
        onClick={checkoutHandler}
      >
        Checkout
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, Thanks for your purchase!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
