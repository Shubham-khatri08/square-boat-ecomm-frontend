import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ReactLogo } from "../../logo.svg";
import { CART_ADD_ITEM } from "../../redux/actions/cartActions";

export default function Home() {
  const [products, setProducts] = useState([]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  console.log("cartItems", cartItems);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => {
        setProducts(response.data.data.products);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleAddToCart = (product) => {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        qty: 1,
      },
    });
    // localStorage.setItem("cartItems", cartItems);
  };

  return (
    <Container>
      <Row>
        {products.length
          ? products.map((product, index) => (
              <Col xs="6" md="4" key={index}>
                <Card style={{ width: "18rem" }}>
                  <ReactLogo />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      ₹{product.price}
                    </Card.Subtitle>
                    <Card.Text>{product.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleAddToCart(product);
                      }}
                    >
                      Add to Card
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          : ""}
      </Row>
    </Container>
  );
}
