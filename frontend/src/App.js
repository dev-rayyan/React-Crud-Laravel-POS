import React from "react";
import { 
  Container, 
  Row, 
  Col, 
  Nav, 
  NavItem, 
  NavLink ,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, 
} from "reactstrap";
import { Switch, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import profile from "./assets/image/profile.png";
import "./App.css";
import ProductList from "./components/ProductList";
import CustomerList from "./components/CustomerList";
import SaleList from "./components/SaleList";
import POS from "./pages/pos/";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Container fluid={true}>
            <Row>
              <Col sm="2" className="text-center header-col-brand">
              <Link to="/">REACT</Link>
              </Col>
              <Col sm="8" className="header-col-nav">
                <Nav className="me-auto">
                  <Link to="/pos">
                  <NavLink>POS</NavLink>
                  </Link>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Invetory
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Categories</DropdownItem>
                      <Link to="/products">
                        <DropdownItem>Products List</DropdownItem>
                      </Link>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Customers
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link to="/customers">
                        <DropdownItem>Customers List</DropdownItem>
                      </Link>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Sales
                  </DropdownToggle>
                  <DropdownMenu right>
                  <Link to="/sales">
                        <DropdownItem>Sales List</DropdownItem>
                      </Link>
                  </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Col>
              <Col sm="2" className="header-col-nav">
                <Nav className=" ml-auto">
                  <NavItem>
                    <div className="profile">
                      <div className="name">Sigit Prasetya</div>
                      <div className="image">
                        <img
                          alt="profile-photos"
                          className="rounded-circle"
                          src={profile}
                          height="40px"
                        />
                      </div>
                    </div>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navlink-padding" href="#">
                      <FontAwesomeIcon icon={faBell} size="lg" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navlink-padding" href="#">
                      <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </header>
        {/* <main className="main-app">
          <Container className="container-main" fluid>
            <POS />
            <ProductList/>
          </Container>
        </main> */}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Switch>
          <Route path="/products" render={() => (<ProductList />)}/>
          <Route path="/customers" render={() => (<CustomerList />)}/>
          <Route path="/pos" render={() => (<POS />)}/>
          <Route path="/sales" render={() => (<SaleList />)}/>
        </Switch>
    </BrowserRouter>
    

    
  );
}

export default App;
