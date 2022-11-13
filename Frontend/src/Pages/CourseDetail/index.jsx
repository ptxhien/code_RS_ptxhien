import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import "./style.scss";
import { Button, ButtonGroup, UncontrolledCarousel } from "reactstrap";
import avatar1 from "../../assets/utils/images/avatars/2.jpg";
import image1 from "../../assets/images/slider-img1.jpg";
import image2 from "../../assets/images/slider-img2.jpg";
import image3 from "../../assets/images/slider-img3.jpg";
import { useHistory, useParams, useLocation } from "react-router";
import http from "../../redux/utils/http";
import * as Types from "./../../redux/constants/actionType";
import { useMemo } from "react";
import { useCart } from "../../hooks/useCart";

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
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CarouselDefault = (props) => (
  <UncontrolledCarousel style={{ height: "100px !important" }} items={items} />
);

const CourseDetail = () => {
  const query = useQuery();
  const skillsAcquiredArray = useMemo(() => {
    let data = query.get("skillsAcquired") || "";
    return data.split(", ");
  }, [query]);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(false);
  const { addCourse } = useCart();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get(`/courses/${id}`);
      setCourse(data);
    } catch (err) {}
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  // const enroll = useCallback(async (e) => {
  //   e.target.disabled = true;
  //   await http.post("/invoices", {
  //     CourseID: course.courseID,
  //     Quality: 1,
  //     ItemPrice: course.feeVND,
  //   }).then((result, a) => {
  //     dispatch({
  //       type: Types.AUTH_UPDATE,
  //       payload: { user: result.user }
  //     });
  //     localStorage.setItem("time_enroll", Date.now());
  //   });
  //   history.push("/dashboard");
  // }, [course]);

  return (
    <>
      <ThemeOptions />
      <AppHeader />
      <CarouselDefault></CarouselDefault>

      <div className="app-main__inner">
        {!course && !loading && (
          <section id="wrapper" className="error-page my-5">
            <div className="error-box">
              <div className="error-body text-center">
                <h1>404</h1>
                <h3 className="text-uppercase">Course not found !</h3>
                <p className="text-muted m-t-30 m-b-30">
                  Your course is currently unavailable
                </p>
                <a
                  href="/"
                  className="btn btn-info btn-rounded waves-effect waves-light m-b-40"
                >
                  Back to home
                </a>{" "}
              </div>
            </div>
          </section>
        )}

        {course && (
          <div className="container-fluid py-5">
            <div className="container py-5">
              <div className="row">
                <div className="col-lg-8">
                  <div className="mb-5">
                    <h1 className="mb-5">
                      {" "}
                      <b>{course.courseTitle}</b>{" "}
                    </h1>
                    <div className="banner">
                      <img
                        className="img-fluid rounded w-100 mb-4"
                        src={
                          "https://img.idesign.vn/2018/11/26/id-huong-dan-tao-bo-icon-phang-23.gif"
                        }
                        alt="Image"
                      />
                      <ButtonGroup className="enroll-btn-group">
                        <Button
                          className="btn-wide btn-icon"
                          color="success"
                          onClick={() => {
                            addCourse(course);
                          }}
                        >
                          <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                          Add to cart
                        </Button>
                      </ButtonGroup>
                    </div>

                    <h6 className="text-primary mb-3">What you'll learn</h6>
                    {/* <p>Fee: {course > 0 + " VND" ? course.feeVND : "free"}</p> */}
                    <p>{course.outcomeLearning}</p>
                    {/* <p>{props.name}</p> */}
                  </div>

                  <div className="mb-5">
                    <h3
                      className="text-uppercase mb-4"
                      style={{ letterSpacing: "5px" }}
                    >
                      1 Comments
                    </h3>

                    <div className="media mb-4">
                      <img
                        src={avatar1}
                        alt="Image"
                        className="img-fluid rounded-circle mr-3 mt-1"
                        style={{ width: "45px" }}
                      />
                      <div className="media-body">
                        <h6>
                          Phạm Thị Xuân Hiền{" "}
                          <small>
                            <i>01 Jan 2022 at 12:00pm</i>
                          </small>
                        </h6>
                        <p>Good</p>
                        <button className="btn btn-sm btn-secondary">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-5 mt-lg-0">
                  {/* Author Bio */}
                  <div className="d-flex flex-column text-center bg-info rounded mb-5 py-5 px-4">
                    <img
                      src={
                        "https://png.pngtree.com/element_our/png_detail/20181226/trainingcourseonlinecomputerchat-line-icon--vector-isola-png_285274.jpg"
                      }
                      className="img-fluid rounded-circle mx-auto mb-3"
                      style={{ width: "100px" }}
                    />
                    <h3 className="text-white mb-3"> {course.provider}</h3>
                  </div>

                  {/* Tag Cloud */}
                  <div className="mb-5">
                    <h3
                      className="text-uppercase mb-4"
                      style={{ letterSpacing: "2px" }}
                    >
                      <b>SKILLS COURSES</b>
                    </h3>
                    <div className="d-flex flex-wrap m-n1">
                      {course.technologySkill
                        .split(", ")
                        .map((skill, index) => (
                          <a
                            href=""
                            onClick={(e) => e.preventDefault()}
                            className={`btn ${
                              skillsAcquiredArray.includes(skill)
                                ? "active-btn"
                                : "btn-outline-primary"
                            } m-1`}
                            key={index}
                          >
                            {skill}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetail;
