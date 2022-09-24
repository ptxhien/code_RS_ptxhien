import React, { Fragment, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Row,
  Col,
  Button,
  CardHeader,
  Container,
  Card,
  CardBody,
  Progress,
  ListGroup,
  ListGroupItem,
  CardFooter,
  CustomInput,
  Input,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
} from "reactstrap";

import ThemeOptions from "../../Layout/ThemeOptions/";
import AppHeader from "../../Layout/AppHeader/";

import "./style.scss";
import { Redirect } from "react-router";
import { getInvoices } from "../../redux/actions/invoices";

export default function Dashboards() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.accountReducer);
  const invoicesReducer = useSelector((state) => state.invoicesReducer);

  useEffect(() => {
    dispatch(getInvoices());
  }, [])


  return (
    <>
      {auth.isLogged ? (
        <>
          <ThemeOptions />
          <AppHeader />
          <div className="app-main ">
            <div className="app-main__inner">
              <h2>Purchase History</h2>

              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course </th>
                    <th>Course Title </th>
                    <th>Technology Skill </th>
                    <th>Price </th>
                    <th>Purchase Date </th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesReducer.data.map((row) => (
                    <tr>
                      <td>{row.InvoiceNo}</td>
                      <td>{row.CourseID}</td>
                      <td>{row.course.courseTitle}</td>
                      <td>{row.course.technologySkill}</td>
                      <td>{row.ItemPrice}</td>
                      <td>{row.InvoiceDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}
