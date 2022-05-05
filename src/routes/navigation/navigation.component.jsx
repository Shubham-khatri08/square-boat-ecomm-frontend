import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { USER_LOGOUT } from "../../redux/actions/userActions";

export default function Navigation() {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    dispatch({ type: USER_LOGOUT });
    navigate("/login");
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <Link to="/">SquareBoat</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!userInfo && (
                <>
                  <Nav.Link>
                    <Link to="/login">Login</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/signup">Signup</Link>
                  </Nav.Link>
                </>
              )}
              {userInfo && (
                <>
                  <NavDropdown
                    title={`${userInfo?.user?.name}`}
                    id="navbarScrollingDropdown"
                  >
                    {userInfo && userInfo?.user.role === "admin" && (
                      <>
                        <NavDropdown.Item>
                          <Link to="/admin/products">Products</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <Link to="/admin/orders">Orders</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}
                    <NavDropdown.Item>
                      <Link to="/user-orders">My Orders</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              <Nav.Link>
                <Link to="/cart">Cart</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
