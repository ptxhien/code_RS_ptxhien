import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import { useCart } from "../../hooks/useCart";
import { Col, Row, Button } from "reactstrap";

export default function Cart() {
  const { cart, deleteCourse, selectItem, selectAllItem, enroll } = useCart();
  return (
    <>
      <ThemeOptions />
      <AppHeader />
      <div className="app-main__inner">
        <div
          style={{
            padding: 100,
          }}
        >
          <h1>CART</h1>
          <h4>You have {cart.length} courses in cart</h4>
          <div>
            <input
              id="checkall"
              type="checkbox"
              checked={!cart.filter((item) => !item.isSelected).length}
              onChange={(e) => selectAllItem(e.target.checked)}
            />
            <label style={{ marginLeft: 10 }} htmlFor="checkall">
              ALL
            </label>
          </div>
          <Row style={{ display: "flex" }}>
            <Col md={8} style={{ display: "flex", flexDirection: "column" }}>
              {cart.map((course, index) => (
                <Course
                  key={course.CourseID + "-" + index}
                  {...course}
                  index={index}
                  deleteCourse={deleteCourse}
                  selectItem={selectItem}
                />
              ))}
            </Col>
            <Col md={4}>
              <div style={{ backgroundColor: "lightblue", padding: 20,display: "flex", flexDirection: "column" }}>
                <h3>Bill</h3>
                <br />
                <div
                  style={{
                    paddingLeft: 20,
                    display: "flex",
                    borderBottom: "1px solid gray",
                    justifyContent: "space-between",
                  }}
                >
                  <h5>TOTAL</h5>
                  <h5>
                    {cart.reduce((acc, cur) => {
                      if (cur.isSelected) {
                        return acc + cur.feeVND;
                      }
                      return acc;
                    }, 0)}
                  </h5>
                </div>
                <Button onClick={enroll} color="primary" className=" mb-2 mt-2 ml-auto mr-2 py-2 px-4 btn-icon">
                  PAY
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

function Course(props) {
  return (
    <div style={{ display: "flex", marginTop: 20 }}>
      <input
        type="checkbox"
        checked={props.isSelected || false}
        onClick={() => props.selectItem(props.index)}
      />
      <img
        style={{ marginLeft: 20 }}
        src={
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIq54GdfdVl775njXwO5XC3IjHu9IX6LzuVg&usqp=CAU"
        }
      />
      <div
        style={{
          marginLeft: 20,
          display: "flex",
          flexDirection: "column",
          flex: "1",
        }}
      >
        <h4>{props.courseTitle}</h4>
        <h6>{props.provider}</h6>

        <h4 style={{ marginTop: "auto", marginLeft: "auto" }}>
          {props.feeVND == 0 ? "FREE" : props.feeVND}
        </h4>
      </div>
      <i
        onClick={() => props.deleteCourse(props.index)}
        style={{ fontSize: 36, cursor: "pointer" }}
        className="pe-7s-trash btn-icon-wrapper"
      ></i>
    </div>
  );
}
