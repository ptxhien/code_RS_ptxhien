import React, { useEffect, useContext, createContext } from "react";
import http from "../redux/utils/http";
import { useLocalStorage } from "./useLocalStorage";
import { useHistory } from "react-router";

const cartContext = createContext();

export function ProvideCart({ children }) {
  const cart = useProvideCart();
  return <cartContext.Provider value={cart}>{children}</cartContext.Provider>;
}

export const useCart = () => {
  return useContext(cartContext);
};

function useProvideCart() {
  const [cart, setCart] = useLocalStorage("cart", []);
  const history = useHistory();
  useEffect(() => {}, []);
  const addCourse = (course) => {
    setCart([...cart, course]);
  };
  const deleteCourse = (index) => {
    setCart(cart.filter((_, idx) => index != idx));
  };

  const selectItem = (index) => {
    setCart(
      cart.map((item, idx) => ({
        ...item,
        isSelected: index == idx ? !item.isSelected : item.isSelected,
      }))
    );
  };
  const selectAllItem = (check) => {
    setCart(cart.map((item) => ({ ...item, isSelected: check })));
  };
  const enroll = async () => {
    await Promise.all(
      cart
        .filter((course) => course.isSelected)
        .map((course, idx) =>
          new Promise(resolve => setTimeout(resolve, 500 * idx)).then(() => http.post("/invoices", {
            CourseID: course.courseID,
            Quality: 1,
            ItemPrice: course.feeVND,
          }))
        )
    );
    setCart(cart.filter((item) => !item.isSelected));
    history.push("/dashboard");
  };
  return {
    cart,
    addCourse,
    deleteCourse,
    selectItem,
    selectAllItem,
    enroll,
  };
}
