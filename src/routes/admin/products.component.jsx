import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Table, Modal, Button, Form } from "react-bootstrap";

const defaultFormFields = {
  title: "",
  description: "",
  price: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { title, description, price } = formFields;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleReload = () => setReload(!reload);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => {
        setProducts(response.data.data.products);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [reload]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          title,
          description,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        handleClose();
        handleReload();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        handleReload();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Container>
      <Button variant="primary" onClick={handleShow}>
        Create
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Title"
                onChange={handleChange}
                name="title"
                value={title}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Description"
                onChange={handleChange}
                name="description"
                value={description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Price"
                onChange={handleChange}
                name="price"
                value={price}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>₹{product.price}</td>
                <td
                  onClick={() => {
                    handleDelete(product._id);
                  }}
                >
                  Delete
                </td>
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
    </Container>
  );
}
