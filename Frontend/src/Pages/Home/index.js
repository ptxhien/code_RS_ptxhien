import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import { GetJobAction } from "../../redux/masterdata/masterDataAction";
import "../Home/style.css";
import { UncontrolledCarousel } from "reactstrap";
// import image1 from "../../assets/utils/images/dropdown-header/abstract1.jpg";
// import image2 from "../../assets/utils/images/dropdown-header/abstract2.jpg";
// import image3 from "../../assets/utils/images/dropdown-header/abstract3.jpg";

import image1 from "../../assets/images/slider-img2.jpg";
import image2 from "../../assets/images/slider-img2.jpg";
import image3 from "../../assets/images/slider-img2.jpg";
import {
  getCourses,
  recommendCourses,
} from "../../redux/actions/courses/courses";
import { splitToSubArr } from "../../utils";

import { toastErrorText } from "../../helpers/toastify";
import { useHistory } from "react-router";
import { DefaultCourses } from "../../Components/Courses";
import RecommendationHandler from "../../Components/RecommendationHandler";
import MethodEnum from "../../Components/Courses/MethodEnum";
import RecommendationCourses from "../../Components/Courses/Recommendation";

const items = [
  {
    key: 1,
    src: image1,
    altText: "Slide 1",
    caption: "Slide 1",
  },
  {
    key: 2,
    src: image2,
    altText: "Slide 2",
    caption: "Slide 2",
  },
  {
    key: 3,
    src: image3,
    altText: "Slide 3",
    caption: "Slide 3",
  },
];

const CarouselDefault = () => (
  <UncontrolledCarousel style={{ height: "100px !important" }} items={items} />
);
/*  */
export default function HomePage() {
  const dispatch = useDispatch();
  const { coursesReducer } = useSelector((state) => state);
  
  const [courseArrays, setCourseArrays] = useState([]);
  const [exception, setException] = useState([]);
  const [bothException, setBothException] = useState([]);
  const history = useHistory();

  const itemsCountPerPage = 8;
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(1);
  const [method, setMethod] = useState(MethodEnum.ONLINE);

  useEffect(() => {
    dispatch(GetJobAction());
    dispatch(getCourses());
  }, []);

  useEffect(() => {
    if (localStorage.getItem("Form") === "online") {
      setMethod(MethodEnum.ONLINE);
    } else if (localStorage.getItem("Form") === "offline") {
      setMethod(MethodEnum.OFFLINE);
    }

    localStorage.removeItem("Form");

    if (!coursesReducer.isRecommended) {
      setTotalItemsCount(coursesReducer.data.length);
      setCourseArrays(splitToSubArr(coursesReducer.data, itemsCountPerPage));
    } else {
      if (method === MethodEnum.ONLINE) {
        const onlineCourses = coursesReducer.online.Course?.length
          ? coursesReducer.online.Course
          : coursesReducer.online.df_rule_ngoaile?.length > 1 &&
            coursesReducer.online.df_rule_ngoaile[1].courses_offer.length
          ? coursesReducer.online.df_rule_ngoaile[1].courses_offer
          : [];
        setTotalItemsCount(onlineCourses.length);
        setCourseArrays(splitToSubArr(onlineCourses, itemsCountPerPage));
        setBothException(coursesReducer?.online?.Exception || []);
      } else if (method === MethodEnum.OFFLINE) {
        const offlineCourses = coursesReducer.offline.Course.length
          ? coursesReducer.offline.Course
          : coursesReducer.offline.df_rule_ngoaile?.length > 1 &&
            coursesReducer.offline.df_rule_ngoaile[1].courses_offer.length
          ? coursesReducer.offline.df_rule_ngoaile[1].courses_offer
          : [];
        setTotalItemsCount(offlineCourses.length);
        setCourseArrays(splitToSubArr(offlineCourses, itemsCountPerPage));
        setBothException(coursesReducer?.offline?.Exception || []);
      }
    }
  }, [coursesReducer, method]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <Fragment>
      <ThemeOptions />
      <AppHeader />
      <CarouselDefault></CarouselDefault>

      {/* < div className="app-main"> */}
      {/* <AppSidebar /> */}
      {/* <div className="app-main__outer"> */}
      <div className="app-main__inner">
        <Fragment>
          <RecommendationHandler />
          <div className="app-main__outer">
            <div className="app-main__inner mt-2 container-fluid">
              {coursesReducer.isLoading ? (
                <div className="m-auto" style={{ width: 200, height: 100 }}>
                  <img src="/images/loading.gif"></img>
                </div>
              ) : coursesReducer.isRecommended ? (
                <RecommendationCourses
                  activePage={activePage}
                  courseArrays={courseArrays}
                  exceptions={exception}
                  bothException={bothException}
                  handlePageChange={handlePageChange}
                  itemsCountPerPage={itemsCountPerPage}
                  totalItemsCount={totalItemsCount}
                  setMethod={setMethod}
                  method={method}
                />
              ) : (
                <DefaultCourses
                  activePage={activePage}
                  courseArrays={courseArrays}
                  handlePageChange={handlePageChange}
                  itemsCountPerPage={itemsCountPerPage}
                  totalItemsCount={totalItemsCount}
                />
              )}
            </div>
          </div>
        </Fragment>
      </div>
    </Fragment>
  );
}
// 