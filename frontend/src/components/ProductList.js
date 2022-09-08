import React from "react";
import {
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Table,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Container
} from "reactstrap";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./index.css";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Customer from "../pages/customer";
import Item from "../pages/item";
import List from "../pages/list";

import ItemAPI from "../services/request/Item";
import SalesAPI from "../services/request/Sales";

import ToastError from "../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faEdit,
  faSync,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const CustomCalender = ({ value, onClick }) => (
  <Button color="success" onClick={onClick}>
    {value}
  </Button>
);

const format_mysql_date = (d) => {
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_item: true,
      sales: {
        customer_id: 0,
        customer_name: "",
        sales_date_display: new Date(),
        sales_date: format_mysql_date(new Date()),
        discount: 0,
        list_cart: [],
        sub_total: 0,
        grand_total: 0,
      },
      list_item: [],
      editItem: {},
      search_item_keyword: "",
      refresh_animation: false,
    };
  }

  refreshItem() {
    this.setState({ refresh_animation: true });
    ItemAPI.itemList()
      .then((result) => {
        this.setState({
          list_item: result.data.data,
          refresh_animation: false,
        });
      })
      .catch((err) => {
        ToastError(err);
        this.setState({ refresh_animation: false });
      });
  }

  newItem = () => {
    this.setState({ new_item: true, editItem: {} });
    this.props.history.push("/products/item");
  };

  editItem = (index) => {
    this.setState({ new_item: false, editItem: this.state.list_item[index] });
  this.props.history.push("/products/item");
  };

  deleteItem = (index) => {
    let detail = this.state.list_item[index];
    let del = window.confirm("Delete item : " + detail.item_name + " ?");
    if (del) {
      ItemAPI.itemDelete({ item_id: detail.item_id })
        .then((result) => {
          toast.success(result.data.message);
          this.refreshItem();
        })
        .catch((err) => {
          ToastError(err);
        });
    }
  };

  
  
  componentDidUpdate() {}
  componentDidMount() {
    this.refreshItem();
  }

  render() {
    const itemlist = this.state.list_item;
    const searchword = this.state.search_item_keyword;
    const listCart = this.state.sales.list_cart;
    let disc = parseFloat(this.state.sales.discount);
    let subs = 0;
    this.state.sales.list_cart.forEach((obj) => {
      subs += parseFloat(obj.item_subtotal);
    });
    let grand_total = subs - (subs * disc) / 100;
    let sub_total = subs;

    return (
      <>
      <main className="main-app">
      <Container className="container-main" fluid>
        <Row className="main-pos">
          <Col sm={12}>
            <Col className="main-pos-right" sm={12}>
              <div className="mb-3">
                <InputGroup size="sm">
                  <Input
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({ search_item_keyword: target.value });
                    }}
                    placeholder="SEARCH PRODUCT HERE..."
                  />
                  <InputGroupAddon addonType="append">
                    <ButtonGroup title="Refresh item list" size="sm">
                      <Button
                        color="warning"
                        onClick={() => {
                          this.refreshItem();
                        }}
                      >
                        <FontAwesomeIcon
                          spin={this.state.refresh_animation}
                          icon={faSync}
                        />
                      </Button>
                      <Button color="primary" onClick={this.newItem}>
                        {" "}
                        + ADD NEW ITEM
                      </Button>
                    </ButtonGroup>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <Table responsive hover borderless>
                  <thead className="table-active">
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th className="text-right">Barcode</th>
                      <th className="text-right">Stock</th>
                      <th className="text-right">Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemlist
                      .filter((itm) =>
                        itm.item_name
                          .toUpperCase()
                          .includes(searchword.toUpperCase())
                      )
                      .map((obj, index) => {
                        return (
                          <tr key={index.toString()}>
                            <td>{index + 1}</td>
                            <td>{obj.item_name}</td>
                            <td className="text-right">{obj.barcode}</td>
                            <td className="text-right">{obj.item_stock}</td>
                            <td className="text-right">{obj.item_price}</td>
                            <td className="text-center">
                              <ButtonGroup size="sm">
                                <Button
                                  title="Edit master item"
                                  color="warning"
                                  onClick={() => {
                                    this.editItem(index);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </Button>
                                <Button
                                  title="Delete item"
                                  onClick={() => {
                                    this.deleteItem(index);
                                  }}
                                  color="danger"
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Col>
        </Row>
          </Container>
          </main>
        <Switch>
          <Route exact path="/" />
          <Route
            path="/customer"
            render={() => (
              <Customer
                new={this.state.new_customer}
                callbackRequest={(id, custname) => {
                  this.setCustomer(id, custname);
                }}
                customerDetail={this.state.editCustomer}
              />
            )}
          />
          <Route path="/list">
            <List />
          </Route>
          <Route
            path="/products/item"
            render={() => (
              <Item
                new={this.state.new_item}
                refreshItem={() => {
                  this.refreshItem();
                }}
                itemDetail={this.state.editItem}
              />
            )}
          />
          
        </Switch>
      </>
    );
  }
}

export default withRouter(ProductList);
