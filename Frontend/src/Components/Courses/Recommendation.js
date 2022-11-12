import React, { useState, useEffect, useMemo } from "react";
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
  Modal,
  // ModalHeader,
  // ModalFooter,
  ModalBody,
} from "reactstrap";

import CourseDetail from "../../Pages/CourseDetail";
import image1 from "../../assets/images/slider-img2.jpg";
import Pagination from "react-js-pagination";
import MethodEnum from "./MethodEnum";
import { useSelector } from "react-redux";
import http from "../../redux/utils/http";
import { toastErrorText } from "../../helpers/toastify";

import "./recommend.scss";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const sortKeys = (obj = { key1: 10, key2: 20 }, type = "ASC" || "DESC") => {
  const transformedArr = [];
  for (var key in obj) {
    transformedArr.push([key, obj[key]]);
  }

  // sort
  transformedArr.sort((a, b) => (type === "ASC" ? a[1] - b[1] : b[1] - a[1]));

  return transformedArr.map(([key]) => key);
};

function RecommendationCourses({
  courseArrays = [],
  courseOnlineArrays,
  courseOfflineArrays,
  exceptions,
  bothException,
  activePage,
  itemsCountPerPage,
  handlePageChange,
  totalItemsCount,
  setMethod,
  method,
  bothStatus,
  bothMessage,
  bothNgoaiLe,
}) {
  const [providedSkills, setProvidedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [openRating, setOpenRating] = useState(false);
  const [openGoogleForm, setOpenGoogleForm] = useState(false);
  const [rating, setRating] = useState(0);

  const coursesReducer = useSelector((state) => state.coursesReducer);

  const [filterArrays, setFilterArrays] = useState([]);
  const courses = useMemo(() => {
    if (filterArrays.length > 0) {
      let temp = [];
      courseArrays.forEach((item) => (temp = temp.concat(item)));
      let filteredArrayCourseByFilters = temp.filter((item) => {
        let skills = item.technologySkill.split(", ");
        for (let i = 0; i < skills.length; i++) {
          for (let j = 0; j < filterArrays.length; j++) {
            if (skills[i] === filterArrays[j]) {
              return true;
            }
          }
        }
        return false;
      });
      return [filteredArrayCourseByFilters];
    } else {
      return courseArrays;
    }
  }, [filterArrays, courseArrays, coursesReducer]);

  useEffect(() => {
    if (coursesReducer.isRecommended && !coursesReducer.shouldShowException) {
      const form = localStorage.getItem("Form");
      if (form === "Offline" && coursesReducer.online.courses.length) {
        setErrorForm("Online");
      } else if (form === "Online" && coursesReducer.offline.courses.length) {
        setErrorForm("Offline");
      }
    }
  }, [coursesReducer]);

  const skills_acquired = useMemo(() => {
    let obj = coursesReducer.skills_acquired || {};
    let arr = Object.keys(obj).map((key) => ({
      label: key,
      value: Number(obj[key]),
    }));
    return arr.sort((a, b) => b.value - a.value);
  }, [coursesReducer]);

  useEffect(() => {
    if (coursesReducer.isRecommended) {
      if (method === MethodEnum.ONLINE) {
        setProvidedSkills(
          sortKeys(
            (coursesReducer.online &&
              coursesReducer.online.lstSkill_Provider) ||
              {},
            "DESC"
          )
        );
        setMissingSkills(
          sortKeys(
            (coursesReducer.online &&
              coursesReducer.online.lstSkill_notProvider) ||
              {},
            "DESC"
          )
        );
      } else if (method === MethodEnum.OFFLINE) {
        setProvidedSkills(
          sortKeys(
            (coursesReducer.offline &&
              coursesReducer.offline.lstSkill_Provider) ||
              {},
            "DESC"
          )
        );
        setMissingSkills(
          sortKeys(
            (coursesReducer.offline &&
              coursesReducer.offline.lstSkill_notProvider) ||
              {},
            "DESC"
          )
        );
      }
    } else {
      setProvidedSkills([]);
      setMissingSkills([]);
    }
  }, [coursesReducer, method]);

  useEffect(() => {
    setTimeout(() => setOpenGoogleForm(true), 20000);
  }, []);

  function lstSkill_acquired() {
    return coursesReducer.skills_acquired;
  }
  function lstSkill_to_learn() {
    return coursesReducer.skills_to_learn;
  }

  function coursesProvidedKkills() {
    let lstSkill_Provider = exceptions.find((el) => !!el.lstSkill_Provider);
    let lstSkill_Provider_text =
      (lstSkill_Provider && lstSkill_Provider.lstSkill_Provider) || "";
    if (!lstSkill_Provider_text) {
      lstSkill_Provider = exceptions.find(
        (el) => !!el.lstSkill_Provider_ngoaile
      );
      lstSkill_Provider_text =
        (lstSkill_Provider && lstSkill_Provider.lstSkill_Provider_ngoaile) ||
        "";
    }
    if (!lstSkill_Provider_text) {
      lstSkill_Provider =
        bothNgoaiLe.ExceptionDetail &&
        bothNgoaiLe.ExceptionDetail.find(
          (el) => !!el.lstSkill_Provider_ngoaile
        );
      lstSkill_Provider_text =
        (lstSkill_Provider && lstSkill_Provider.lstSkill_Provider_ngoaile) ||
        "";
    }
    return lstSkill_Provider_text;
  }

  function lstSkillNotProvider() {
    let lstSkill_notProvider = exceptions.find(
      (el) => !!el.lstSkill_notProvider
    );
    let text =
      (lstSkill_notProvider && lstSkill_notProvider.lstSkill_notProvider) || "";
    if (!text) {
      lstSkill_notProvider = exceptions.find(
        (el) => !!el.lstSkill_notProvider_ngoaile
      );
      text =
        (lstSkill_notProvider &&
          lstSkill_notProvider.lstSkill_notProvider_ngoaile) ||
        "";
    }
    if (!text) {
      lstSkill_notProvider =
        bothNgoaiLe.ExceptionDetail &&
        bothNgoaiLe.ExceptionDetail.find(
          (el) => !!el.lstSkill_notProvider_ngoaile
        );
      text =
        (lstSkill_notProvider &&
          lstSkill_notProvider.lstSkill_notProvider_ngoaile) ||
        "";
    }
    return text;
  }

  const mappingNote = {
    Skill: {
      noteText: "position job",
      subNoteText: (bothException) => {
        return null;
      },
    },
    Form: {
      noteText: "study form",
      subNoteText: (bothException) => {
        return null;
      },
    },
    Lan: {
      noteText: "language",
      subNoteText: (bothException, bothNgoaiLe) => {
        const lan =
          bothException.find((el) => el.ExceptionType == "Lan") ||
          (bothNgoaiLe.ExceptionDetail &&
            bothNgoaiLe.ExceptionDetail.find(
              (el) => el.ExceptionType == "Lan"
            ));
        return lan && lan.lan_remain
          ? `The courses' language is: ${lan.lan_remain}`
          : null;
      },
    },
    Fee: {
      noteText: "fee",
      subNoteText: (bothException, bothNgoaiLe) => {
        const fee =
          bothException.find((el) => el.ExceptionType == "Fee") ||
          (bothNgoaiLe.ExceptionDetail &&
            bothNgoaiLe.ExceptionDetail.find(
              (el) => el.ExceptionType == "Fee"
            ));
        return fee && fee.Output
          ? `Total study budget: ${new Intl.NumberFormat("it-IT").format(
              fee.Output
            )} VNĐ 💵`
          : null;
      },
    },
    Duration: {
      noteText: "duration",
      subNoteText: (bothException, bothNgoaiLe) => {
        const duration =
          bothException.find((el) => el.ExceptionType == "Duration") ||
          (bothNgoaiLe.ExceptionDetail &&
            bothNgoaiLe.ExceptionDetail.find(
              (el) => el.ExceptionType == "Duration"
            ));
        return duration && duration.Output
          ? `Total study time: ${duration.Output} ⏲️`
          : null;
      },
    },
    Frame_Remain: {
      noteText: "studying period",
      subNoteText: (bothException, bothNgoaiLe) => {
        const frameRemain =
          bothException.find((el) => el.ExceptionType == "Frame_Remain") ||
          (bothNgoaiLe.ExceptionDetail &&
            bothNgoaiLe.ExceptionDetail.find(
              (el) => el.ExceptionType == "Frame_Remain"
            ));
        return frameRemain && frameRemain.frame_remain
          ? `These courses are in the study period, including: ${frameRemain.frame_remain} 🗓️`
          : null;
      },
    },
  };

  function showStatusMessage() {
    let note,
      subNote,
      subNoteList = [];
    switch (bothStatus) {
      case 200:
      case 201:
      case 202: {
        const noteArr = [],
          subNoteArr = [];
        const mappings = Object.entries(mappingNote);
        mappings.forEach(([key, value]) => {
          const subNoteText = value.subNoteText(bothException, bothNgoaiLe);
          if (!subNoteText) {
            noteArr.push(value.noteText);
            return;
          }
          subNoteArr.push(value.noteText);
          subNoteList.push(subNoteText);
        });
        // note = `We suggest the ideal courses for your ${noteArr.length > 1 ? (noteArr.slice(0, -1).join(', ') + ', and ' + noteArr.slice(-1)) : noteArr[0]} you know.`;
        note = `We recommend the courses that are best for you based on your ${
          noteArr.length > 1
            ? noteArr.slice(0, -1).join(", ") + " and " + noteArr.slice(-1)
            : noteArr[0]
        }.`;
        subNote =
          subNoteArr.length === 0
            ? ""
            : `However, there are differences when compared to certain criteria, like as: ${
                subNoteArr.length > 1
                  ? subNoteArr.slice(0, -1).join(", ") +
                    " and " +
                    subNoteArr.slice(-1)
                  : subNoteArr[0]
              }.`;
        return (
          <Row style={{ padding: "10px 20px" }}>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "block",
                width: "100%",
              }}
            >
              {note}
            </span>
            {subNoteArr.length > 0 && (
              <span
                style={{ fontSize: "1rem", display: "block", width: "100%" }}
              >
                {subNote}
              </span>
            )}
            <ul style={{ width: "100%" }}>
              {subNoteList.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </Row>
        );
      }
      case 203:
        note =
          "You have enough skills that the profession requires, you can apply for that position.";
        return (
          <Row style={{ padding: "10px 20px" }}>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "block",
                width: "100%",
              }}
            >
              {note}
            </span>
          </Row>
        );
      case 400:
      case 401:
      case 402:
      case 403:
        note =
          (!courseOfflineArrays || !courseOfflineArrays[0]) &&
          (!courseOnlineArrays || courseOnlineArrays[0])
            ? // `Không có khoá học ${method === MethodEnum.ONLINE ? "Online" : "Offline"} phù hợp với tiêu chí của bạn.` :
              `No ${
                method === MethodEnum.ONLINE ? "Online" : "Offline"
              } courses meet your requirements.`
            : "The system is updating courses related to the required missing skills.";
        subNote =
          "You might look at five occupations that are associated with the career you are pursuing: ";
        if (bothException && bothException[0] && bothException[0].Job_offer) {
          subNoteList = (
            bothException &&
            bothException[0] &&
            bothException[0].Job_offer
          ).split(", ");
        }
        return (
          <Row style={{ padding: "10px 20px" }}>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "block",
                width: "100%",
              }}
            >
              {note}
            </span>
            {subNoteList && subNoteList.length > 0 && (
              <>
                <span
                  style={{ fontSize: "1rem", display: "block", width: "100%" }}
                >
                  {subNote}
                </span>
                <ul style={{ width: "100%" }}>
                  {subNoteList.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </>
            )}
          </Row>
        );
    }
    return "";
  }

  function deleteCourse(skill) {
    // let text ="";
    console.log("heloo" + skill);
    // return text;
  }

  // function deleteCourse(skill) {
  //   console.log('heloo' + skill);

  //   // return coursesReducer.technologySkill.split(", ").include(skill)=== true;
  //   if (coursesReducer.isRecommended) {
  //     if (method === MethodEnum.ONLINE) {
  //       // newCourseList = coursesReducer.online.filter((course) => course.technologySkill.split(", ") !== skill);
  //       newCourseList = coursesReducer.online.technologySkill.split(", ").include(skill)=== true;
  //     } else if (method === MethodEnum.OFFLINE) {
  //       newCourseList = coursesReducer.offline.technologySkill.split(", ").include(skill)=== true;
  //     }
  //   return newCourseList;
  // };

  return (
    <Row>
      <Col md={9}>
        <Card>
          <Modal
            isOpen={isOpen && !coursesReducer.shouldShowException && errorForm}
            className="exception-popup"
            centered
            toggle={() => setIsOpen(false)}
          >
            <ModalBody>
              <div className="exception">
                <div className="exception-title">
                  There are several occupations are similar with your own
                  choosen one.
                </div>
                <div className="exception-body">
                  <div>1. Data Science</div>
                  <div>2. Data Science</div>
                  <div>3. Data Science</div>
                  <div>4. Data Science</div>
                  <div>5. Data Science</div>
                </div>
              </div>

              <div className="exception">
                <div className="exception-title">
                  There are several courses with languages you may not know
                </div>
                <div className="exception-body">
                  <div className="d-flex flex-nowrap justify-content-between">
                    <div className="languages">English, Cambodia</div>
                    <button className="see-result-btn"> See results </button>
                  </div>
                </div>
              </div>

              <div className="exception">
                <div className="exception-title">
                  There are several offline courses may be suitable with you
                </div>
                <div className="exception-body">
                  <div className="d-flex flex-nowrap justify-content-between">
                    <div className="languages"></div>
                    <button className="see-result-btn"> See results </button>
                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>
          <CardBody>
            {showStatusMessage()}
            <Row>
              {courses[activePage - 1] &&
                courses[activePage - 1].map((item, index) => {
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
                            ({item.peopleRating ? item.peopleRating : 0})
                          </span>
                        </CardBody>
                        <CardBody>
                          <img
                            src={
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIq54GdfdVl775njXwO5XC3IjHu9IX6LzuVg&usqp=CAU"
                            }
                            width={"100%"}
                          ></img>
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
                                : new Intl.NumberFormat("it-IT").format(
                                    item.feeVND
                                  ) + " VNĐ"}
                            </Button>
                            <Link
                              target="_blank"
                              to={{
                                pathname: `course/${item.courseID}`,
                                search: `?skillsAcquired=${coursesReducer.skills_acquired}`,
                              }}
                              className="btn-wide mb-2 btn-icon d-inline-block btn btn-outline-primary"
                            >
                              <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                              Details
                            </Link>

                            {/* <CourseDetail nam = 'hien'/> */}
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
            <CardTitle className="text-danger">Learning method</CardTitle>
            <Row>
              <Col md={12}>
                <FormGroup className="ml-4">
                  <Input
                    type="radio"
                    name="learningMethod"
                    value="Online"
                    id="online"
                    onChange={() => {
                      setMethod(MethodEnum.ONLINE);
                    }}
                    checked={method === MethodEnum.ONLINE}
                  />
                  <Label check for="online">
                    Online
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
                    onChange={() => {
                      setMethod(MethodEnum.OFFLINE);
                    }}
                    checked={method === MethodEnum.OFFLINE}
                  />
                  <Label check for="offline">
                    Offline
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>

          <CardBody>
            <CardTitle className="text-danger">SKILL REQUIRE FOR ...</CardTitle>
            <Row>
              <Col md={12}>
                {/* <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Skills Acquired
                </Label> */}
                <div>
                  {skills_acquired.map((item, index) => (
                    <span
                      onClick={() => {
                        
                      }}
                      className={`pointer btn btn-outline-primary m-1 p-${item.value / 3 > 3 ? "3" : item.value / 3 > 2 ? "2" : "1"}`}
                      key={index}
                    >
                      {item.label}
                      {item.value}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
            {/* <Row>
              <Col md={12}>
                <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Skills to learn
                </Label>
                <div>{lstSkill_to_learn()}</div>
              </Col>
            </Row> */}
          </CardBody>

          <CardBody>
            <CardTitle className="text-danger">
              SKILL TO LEARN FOR ...
            </CardTitle>
            <Row>
              <Col md={12}>
                {/* <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Skills the course provides
                </Label> */}

                <div>
                  {/* {coursesProvidedKkills().split(", ").map((skill, index) => (
                      <a href="" onClick={(e) => e.preventDefault()} className="btn btn-outline-primary m-1" key={index}>{skill}</a>
                    ))} */}
                  {coursesProvidedKkills()
                    .split(", ")
                    .map((skill, index) => {
                      // let isHaveAnyCourse = false
                      // for (let i = 0; i < courseArrays.length; i++) {
                      //   if (courseArrays[i].technologySkill) {
                      //     let skills = courseArrays[i].technologySkill.split(", ")
                      //     if (skills.includes(skill)) {
                      //       isHaveAnyCourse = true
                      //       break
                      //     }
                      //   }
                        
                      // } 
                      
                      return (<span
                        onClick={() => {
                          if (filterArrays.includes(skill)) {
                            setFilterArrays(
                              filterArrays.filter((item) => skill !== item)
                            );
                          } else {
                            setFilterArrays([...filterArrays, skill]);
                          }
                        }}
                        className={`pointer btn btn-outline-primary m-1 ${
                          filterArrays.includes(skill) ? "active-btn" : ""
                        }`}
                        key={index}
                      >
                        {skill}
                      </span>)
})}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                {/* <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Skills the course unprovided
                </Label> */}
                <div>
                  {/* {lstSkillNotProvider()} */}
                  {lstSkillNotProvider()
                    .split(", ")
                    .map((skill, index) => (
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          toastErrorText(
                            "No exists courses is provided for this skill."
                          );
                        }}
                        className="btn btn-outline-secondary m-1"
                        key={index}
                      >
                        {skill}
                      </a>
                    ))}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default RecommendationCourses;
