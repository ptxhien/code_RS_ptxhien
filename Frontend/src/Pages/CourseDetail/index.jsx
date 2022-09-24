import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import "./style.scss";
import { Button, ButtonGroup, UncontrolledCarousel } from "reactstrap";
import avatar1 from "../../assets/utils/images/avatars/2.jpg";
import course1 from "../../assets/utils/images/courses/course-1.jpg";
import image1 from "../../assets/images/slider-img1.jpg";
import image2 from "../../assets/images/slider-img2.jpg";
import image3 from "../../assets/images/slider-img3.jpg";
import { useHistory, useParams } from "react-router";
import http from "../../redux/utils/http";
import * as Types from "./../../redux/constants/actionType";

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

export default function CourseDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(false);

  const getData = useCallback(async() => {
    setLoading(true);
    try {
      const {data} = await http.get(`/courses/${id}`)
      setCourse(data);
    } catch (err) {
      
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const enroll = useCallback(async (e) => {
    e.target.disabled=true;
    await http.post("/invoices", {
      CourseID: course.courseID, 
      Quality: 0, 
      ItemPrice: course.feeVND,
    }).then((result, a) => {
      dispatch({
        type: Types.AUTH_UPDATE,
        payload: {user: result.user}
      })
    });
    history.push("/dashboard");
  }, [course]);

  return (
    <>
      <ThemeOptions />
      <AppHeader />
      <CarouselDefault></CarouselDefault>

      {/* < div className="app-main"> */}
      {/* <AppSidebar /> */}
      {/* <div className="app-main__outer"> */}
      <div className="app-main__inner">
        
        {!course && !loading && <section id="wrapper" className="error-page my-5">
          <div className="error-box">
            <div className="error-body text-center">
              <h1>404</h1>
              <h3 className="text-uppercase">Course not found !</h3>
              <p className="text-muted m-t-30 m-b-30">Your course is currently unavailable</p>
              <a href="/" className="btn btn-info btn-rounded waves-effect waves-light m-b-40">Back to home</a> </div>
          </div>
        </section>}

        {course && <div className="container-fluid py-5">
          <div className="container py-5">
            <div className="row">
              <div className="col-lg-8">
                <div className="mb-5">
                  <h6 className="text-primary mb-3">Jan 01, 2050</h6>
                  <h1 className="mb-5"> {course.courseTitle} </h1>
                  <div className="banner">
                    <img className="img-fluid rounded w-100 mb-4" src={course1} alt="Image" />
                    <ButtonGroup className="enroll-btn-group">
                      
                      <Button
                        className="btn-wide btn-icon"
                        color="success"
                        onClick={enroll}
                      >
                        <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                        Enroll for {course.feeVND > 0 + " VND" ? course.feeVND : "free"}
                      </Button>
                    </ButtonGroup>
                  </div>
                  <p>{course.outcomeLearning}</p>
                </div>
                {/* Comment List */}
                <div className="mb-5">
                  <h3 className="text-uppercase mb-4" style={{letterSpacing: '5px'}}>3 Comments</h3>
                  <div className="media mb-4">
                    <img src={avatar1} alt="Image" className="img-fluid rounded-circle mr-3 mt-1" style={{width: '45px'}} />
                    <div className="media-body">
                      <h6>John Doe <small><i>01 Jan 2045 at 12:00pm</i></small></h6>
                      <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum et no at.
                        Kasd diam tempor rebum magna dolores sed sed eirmod ipsum. Gubergren clita aliquyam
                        consetetur sadipscing, at tempor amet ipsum diam tempor consetetur at sit.</p>
                      <button className="btn btn-sm btn-secondary">Reply</button>
                    </div>
                  </div>
                  <div className="media mb-4">
                    <img src={avatar1} alt="Image" className="img-fluid rounded-circle mr-3 mt-1" style={{width: '45px'}} />
                    <div className="media-body">
                      <h6>John Doe <small><i>01 Jan 2045 at 12:00pm</i></small></h6>
                      <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum et no at.
                        Kasd diam tempor rebum magna dolores sed sed eirmod ipsum. Gubergren clita aliquyam
                        consetetur sadipscing, at tempor amet ipsum diam tempor consetetur at sit.</p>
                      <button className="btn btn-sm btn-secondary">Reply</button>
                      <div className="media mt-4">
                        <img src={avatar1} alt="Image" className="img-fluid rounded-circle mr-3 mt-1" style={{width: '45px'}} />
                        <div className="media-body">
                          <h6>John Doe <small><i>01 Jan 2045 at 12:00pm</i></small></h6>
                          <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum
                            et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.
                            Gubergren clita aliquyam consetetur, at tempor amet ipsum diam tempor at
                            sit.</p>
                          <button className="btn btn-sm btn-secondary">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="col-lg-4 mt-5 mt-lg-0">
                {/* Author Bio */}
                <div className="d-flex flex-column text-center bg-info rounded mb-5 py-5 px-4">
                  <img src={avatar1} className="img-fluid rounded-circle mx-auto mb-3" style={{width: '100px'}} />
                  <h3 className="text-white mb-3">John Doe</h3>
                  <p className="text-white m-0">Conset elitr erat vero dolor ipsum et diam, eos dolor lorem, ipsum sit
                    no ut est ipsum erat kasd amet elitr</p>
                </div>
                {/* Tag Cloud */}
                <div className="mb-5">
                  <h3 className="text-uppercase mb-4" style={{letterSpacing: '2px'}}>Tags</h3>
                  <div className="d-flex flex-wrap m-n1">
                    {course.technologySkill.split(", ").map((skill, index) => (
                      <a href="" onClick={(e) => e.preventDefault()} className="btn btn-outline-primary m-1" key={index}>{skill}</a>
                    ))}
                  </div>
                </div>

                {/* Comment Form */}
                <div className="bg-info rounded p-3">
                  <h3 className="text-uppercase text-white mb-4" style={{letterSpacing: '5px'}}>Leave a comment</h3>
                  <form>
                    <div className="form-group">
                      <label className="text-white" htmlFor="name">Name *</label>
                      <input type="text" className="form-control border-0" id="name" />
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="email">Email *</label>
                      <input type="email" className="form-control border-0" id="email" />
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="website">Website</label>
                      <input type="url" className="form-control border-0" id="website" />
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="message">Message *</label>
                      <textarea id="message" cols={30} rows={5} className="form-control border-0" defaultValue={""} />
                    </div>
                    <div className="form-group mb-0">
                      <input type="submit" defaultValue="Leave Comment" className="btn btn-primary py-md-2 px-md-4 font-weight-semi-bold" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
