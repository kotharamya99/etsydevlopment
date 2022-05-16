import React, { Fragment } from 'react'
import axiosInstance from "../utils/axios";
import { Container, Navbar, FormControl, Form, Button, NavDropdown, Nav, FontAwesomeIcon} from 'react-bootstrap'
function NavigationBar() {
  return (
    <Fragment> 
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#home" style={{ color: "orange" }}>Etsy</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Form className="d-flex" style={{ width: "100%" }}>
                  <FormControl style={{borderRadius: "25px",borderColor:"black"}}
                    type="search"
                    placeholder="Search for anything"
                    className="me-2"
                    aria-label="Search"
                  />
                <Button variant="primary" style={{backgroundColor: "orange",border:"none"}}>Search</Button>
                </Form>
                <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
                  <Nav.Link href="#action2"><i class="fa fa-shopping-cart" aria-hidden="true"></i></Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                  <Button variant="primary" style={{backgroundColor: "orange",border:"none"}}>Sign In</Button>
                  <Nav>
                  <Nav.Link href="#action2"><i class="fa fa-shopping-cart" aria-hidden="true"></i></Nav.Link>
                  </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </Fragment> 
  )
}

export default NavigationBar


