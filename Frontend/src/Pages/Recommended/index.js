import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Row,
  Button,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardLink,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import { GetJobAction } from "../../redux/masterdata/masterDataAction";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../Home/style.css";
import { UncontrolledCarousel } from "reactstrap";
import Pagination from "react-js-pagination";

import image1 from "../../assets/images/slider-img2.jpg";
import image2 from "../../assets/images/slider-img2.jpg";
import image3 from "../../assets/images/slider-img2.jpg";
import Rating from "react-rating";
import ReactTooltip from "react-tooltip";
import {
  getCourses,
  recommendCourses,
} from "../../redux/actions/courses/courses";
import { splitToSubArr } from "../../utils";
import ModalFaded from "../Components/Modal/Examples/ModalFaded";
import { toastErrorText } from "../../helpers/toastify";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";

const mockedProvidedSkills = {
  "Objective C": 7,
  Swift: 6,
  SwiftUI: 1,
  Xcode: 3,
  IOS: 7,
  "CI/CD": 1,
  "RESTful API": 1,
  C: 2,
  SQLite: 1,
  UI: 2,
  XML: 1,
  Json: 1,
  "Microsoft SQL Server": 1,
  "C#": 1,
};
const mockedMissingSkills = {
  "Cocoa Touch": 3,
  "Swift 5": 1,
  "Microsoft Visual Studio": 1,
  Xamarin: 2,
  REST: 1,
  Delegation: 1,
  KVC: 1,
  KVO: 1,
  Notification: 1,
  RxSwift: 1,
  "IOS SDK": 1,
  IDE: 1,
  MySQL: 1,
  "React Native": 1,
  "Human Interface Guidelines": 1,
};

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

const sortKeys = (obj = { key1: 10, key2: 20 }, type = "ASC" || "DESC") => {
  // transform object
  const transformedArr = [];
  for (var key in obj) {
    transformedArr.push([key, obj[key]]);
  }

  // sort
  transformedArr.sort((a, b) => (type === "ASC" ? a[1] - b[1] : b[1] - a[1]));

  return transformedArr.map(([key]) => key);
};

const CarouselDefault = () => (
  <UncontrolledCarousel style={{ height: "100px !important" }} items={items} />
);

export default function RecommendationPage() {
  const qs = useQuery();
  const dispatch = useDispatch();
  const { masterdataReducer, coursesReducer, accountReducer } = useSelector(
    (state) => state
  );
  const { online, offline } = coursesReducer;
  const { lsJob } = masterdataReducer;
  const [courseArrays, setCourseArrays] = useState([]);
  const history = useHistory();

  let itemsCountPerPage = 9;
  let [activePage, setActivePage] = useState(1);
  let [totalItemsCount, setTotalItemsCount] = useState(1);
  const providedSkills = sortKeys(mockedProvidedSkills, "DESC");
  const missingSkills = sortKeys(mockedMissingSkills, "DESC");
  const missingSkillString = missingSkills.join(", ");

  useEffect(() => {
    dispatch(GetJobAction());
    dispatch(getCourses());
  }, []);

  useEffect(() => {
    setTotalItemsCount(coursesReducer.data.length);
    setCourseArrays(splitToSubArr(coursesReducer.data, 9));
  }, [coursesReducer]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const recommendationInfo = useRef({
    occupation: "",
    form: "",
    month: "12",
    typeFilter: "progress",
  });

  const submit = () => {
    const errs = [];
    const { occupation, form, month, typeFilter } = recommendationInfo.current;
    const { email } = accountReducer.user;
    // validation
    if (!occupation) {
      errs.push("Occupation is required");
    }
    if (!email) {
      history.push("/login");
      return;
    }

    // fire errs message
    if (errs.length) {
      errs.forEach((err) => {
        toastErrorText(err);
      });
    } else {
      // call api to RS server
      dispatch(recommendCourses(occupation, form, month, email, typeFilter));
    }
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
          <Card>
            <CardBody>
              <Row form>
                <Col md={3}>
                  <FormGroup>
                    <Label for="exampleName">Job</Label>
                    <Select
                      components={makeAnimated()}
                      closeMenuOnSelect={false}
                      getOptionLabel={(option) => option.jobTitle}
                      getOptionValue={(option) => option.jobID}
                      options={lsJob}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(e) => {
                        recommendationInfo.current.occupation = e.jobID;
                      }}
                    />
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <Label for="exampleName">Online/OffLine</Label>
                    
                    
                    <Input
                      type="select"
                      onChange={(e) => {
                        recommendationInfo.current.form = e.target.value;
                      }}
                    >
                      <option value={""}></option>
                      <option value={"Online"}>Online</option>
                      <option value={"OffLine"}>OffLine</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={2}>
                  <FormGroup>
                    <Label for="exampleName">Duration</Label>
                    <Input
                      type="select"
                      onChange={(e) => {
                        recommendationInfo.current.month = e.target.value;
                      }}
                    >
                      <option value={"12"}></option>
                      <option value={"03"}>3 Months</option>
                      <option value={"06"}>6 Months</option>
                      <option value={"09"}>9 Months</option>
                      <option value={"12"}>12 Months</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={2}>
                  <FormGroup>
                    <Label for="exampleName">By progress / By top rating</Label>
                    <Input
                      type="select"
                      onChange={(e) => {
                        recommendationInfo.current.typeFilter = e.target.value;
                      }}
                    >
                      <option value={"progress"}>Progress</option>
                      <option value={"top"}>Top rating</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={2}>
                  <FormGroup>
                    <ModalFaded submit={submit}></ModalFaded>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <Label for="exampleName">Provider</Label>
                    <Input type="select"></Input>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <Label for="exampleName">Level</Label>
                    <Input type="select"></Input>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <div className="app-main__outer">
            <div className="app-main__inner mt-2">
              <Row>
                <Col md={9}>
                  <Card>
                    <CardBody>
                      <Row>
                        {courseArrays[activePage - 1] &&
                          courseArrays[activePage - 1].map((item, index) => {
                            return (
                              <Col md="6" lg="4" key={index}>
                                <Card
                                  data-tip
                                  data-for={item.courseTitle}
                                  body
                                  className="card-shadow-primary border mb-3 p-0"
                                  outline
                                  color="primary"
                                  style={{ borderRadius: 8 }}
                                >
                                  <CardBody title={item.courseTitle}>
                                    <CardTitle
                                      title={item.courseTitle}
                                      className="text-truncate"
                                    >
                                      {item.courseTitle}
                                    </CardTitle>
                                    <CardSubtitle className="mb-0">
                                      {item.provider}
                                    </CardSubtitle>
                                    <span className="mr-1 text-success">
                                      {item.rating ? item.rating : 0}/5
                                    </span>
                                    <Rating
                                      stop={5}
                                      initialRating={item.rating}
                                      emptySymbol={
                                        <span className="mr-1 opacity-2">
                                          <FontAwesomeIcon
                                            size="1x"
                                            icon={faHeart}
                                            color="red"
                                          />
                                        </span>
                                      }
                                      fullSymbol={
                                        <span className="mr-1">
                                          <FontAwesomeIcon
                                            size="1x"
                                            icon={faHeart}
                                            color="red"
                                          />
                                        </span>
                                      }
                                    />
                                    <span className="text-info">
                                      (
                                      {item.peopleRating
                                        ? item.peopleRating
                                        : 0}
                                      )
                                    </span>
                                  </CardBody>
                                  <CardBody>
                                    <img src={image1} width={"100%"}></img>
                                    <span className="multilines-truncate">
                                      {item.outcomeLearning}
                                    </span>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <Button
                                        className="btn-wide mb-2 mr-2 btn-icon"
                                        outline
                                        color="primary"
                                      >
                                        <i className="pe-7s-cash btn-icon-wrapper"></i>
                                        {item.feeVND == 0
                                          ? "Free"
                                          : new Intl.NumberFormat('it-IT').format(item.feeVND) + " VNĐ"}
                                      </Button>
                                      <a
                                        href="#"
                                        className="btn-wide mb-2 btn-icon d-inline-block btn btn-outline-primary"
                                      >
                                        <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                                        Details
                                      </a>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            );
                          })}
                      </Row>
                    </CardBody>
                  </Card>
                  <div className="my-pagination">
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={itemsCountPerPage}
                      totalItemsCount={totalItemsCount}
                      pageRangeDisplayed={3}
                      onChange={handlePageChange}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <Card>
                    <CardBody>
                      <CardTitle className="text-danger">
                        Learning method
                      </CardTitle>
                      <Row>
                        <Col md={12}>
                          <FormGroup className="ml-4">
                            <Input
                              type="radio"
                              name="learningMethod"
                              value="Both"
                              id="both"
                              checked
                            />
                            <Label check for="both">
                              Both
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <FormGroup className="ml-4">
                            <Input
                              type="radio"
                              name="learningMethod"
                              value="Offline"
                              id="offline"
                            />
                            <Label check for="offline">
                              Offline
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <FormGroup className="ml-4">
                            <Input
                              type="radio"
                              name="learningMethod"
                              value="Online"
                              id="online"
                            />
                            <Label check for="online">
                              Online
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>

                    <CardBody>
                      <CardTitle className="text-danger">
                        Missing Skill
                      </CardTitle>
                      <Row>
                        <Col md={12}>
                          <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                            Provided skills
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          {providedSkills.map((skill) => (
                            <FormGroup className="ml-4">
                              <Input
                                type="radio"
                                name="providedSkills"
                                value={skill}
                                id={skill}
                              />
                              <Label check for={skill}>
                                {skill}
                              </Label>
                            </FormGroup>
                          ))}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                            Unprovied skills
                          </Label>
                          <div>{missingSkillString}</div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                            Exception
                          </Label>
                          <div>{"here"}</div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Fragment>
      </div>
      {/* </div> */}
      {/* </div> */}
    </Fragment>
  );
}
