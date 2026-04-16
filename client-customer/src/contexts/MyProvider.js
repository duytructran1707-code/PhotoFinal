import React, { Component } from "react";
import MyContext from "./MyContext";

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      customer: null,
      mybookings: [],
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMybookings: this.setMybookings,
    };
  }
  setToken = (value) => {
    this.setState({ token: value });
  };
  setCustomer = (value) => {
    this.setState({ customer: value });
  };
  setMybookings = (value) => {
    this.setState({ mybookings: value });
  };
  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;
