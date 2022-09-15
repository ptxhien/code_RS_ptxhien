import React, { useState, useEffect } from "react";
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
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import image1 from "../../assets/images/slider-img2.jpg";
import Pagination from "react-js-pagination";
import MethodEnum from "./MethodEnum";
import { useSelector } from "react-redux";
import http from "../../redux/utils/http";
import { toastSuccessText } from "../../helpers/toastify";

import "./recommend.scss";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

function RecommendationCourses({
  courseArrays,
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
  bothNgoaiLe
}) {
  const [providedSkills, setProvidedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [openRating, setOpenRating] = useState(false);
  const [openGoogleForm, setOpenGoogleForm] = useState(false);
  const [rating, setRating] = useState(0);

  const coursesReducer = useSelector((state) => state.coursesReducer);

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

  useEffect(() => {
    if (coursesReducer.isRecommended) {
      if (method === MethodEnum.ONLINE) {
        setProvidedSkills(
          sortKeys(coursesReducer.online && coursesReducer.online.lstSkill_Provider || {}, "DESC")
        );
        setMissingSkills(
          sortKeys(coursesReducer.online && coursesReducer.online.lstSkill_notProvider || {}, "DESC")
        );
      } else if (method === MethodEnum.OFFLINE) {
        setProvidedSkills(
          sortKeys(coursesReducer.offline && coursesReducer.offline.lstSkill_Provider || {}, "DESC")
        );
        setMissingSkills(
          sortKeys(coursesReducer.offline && coursesReducer.offline.lstSkill_notProvider || {}, "DESC")
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

  function coursesProvidedKkills() {
    let lstSkill_Provider = exceptions.find(el => !!el.lstSkill_Provider);
    let lstSkill_Provider_text = lstSkill_Provider && lstSkill_Provider.lstSkill_Provider || "";
    if (!lstSkill_Provider_text) {
      lstSkill_Provider = exceptions.find(el => !!el.lstSkill_Provider_ngoaile);
      lstSkill_Provider_text = lstSkill_Provider && lstSkill_Provider.lstSkill_Provider_ngoaile || "";
    }
    if (!lstSkill_Provider_text) {
      lstSkill_Provider = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => !!el.lstSkill_Provider_ngoaile);
      lstSkill_Provider_text = lstSkill_Provider && lstSkill_Provider.lstSkill_Provider_ngoaile || "";
    }
    return lstSkill_Provider_text;
  }

  function lstSkillNotProvider() {
    let lstSkill_notProvider = exceptions.find(el => !!el.lstSkill_notProvider);
    let text = lstSkill_notProvider && lstSkill_notProvider.lstSkill_notProvider || "";
    if (!text) {
      lstSkill_notProvider = exceptions.find(el => !!el.lstSkill_notProvider_ngoaile);
      text = lstSkill_notProvider && lstSkill_notProvider.lstSkill_notProvider_ngoaile || "";
    }
    if (!text) {
      lstSkill_notProvider = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => !!el.lstSkill_notProvider_ngoaile);
      text = lstSkill_notProvider && lstSkill_notProvider.lstSkill_notProvider_ngoaile || "";
    }
    return text;
  }

  function showStatusMessage() {
    if (bothStatus == 203 && bothMessage == 'enough skills') {
      return <Row>
          <p style={{width: "100%"}}>
            {"Bạn đã đủ kỹ năng mà nghề nghiệp yêu cầu, bạn có thể ứng tuyển cho vị trí đó."}
          </p>
        </Row>;
    } else if (bothStatus == 201 && bothMessage == 'frameRemain_Fulltime') {
      let fee = bothException.find(el => el.ExceptionType == 'Fee');
      fee = fee && (new Intl.NumberFormat('it-IT').format(fee.Output) + " VNĐ") || '';
      let duration = bothException.find(el => el.ExceptionType == 'Duration');
      let frameRemain = bothException.find(el => el.ExceptionType == 'Frame_Remain');
      return <Row>
            <p style={{width: "100%"}}>
              {"Chúng tôi đề xuất đến bạn những khoá học phù hợp với nghề nghiệp, hình thức học, ngôn ngữ bạn biết." + 
                "Nhưng có sự chênh lệch so với vài tiêu chí như:"
              }
              <ul>
                {/* <li>{"Tổng chi phí lộ trình học: " + (fee && fee.Output)}</li> */}
                <li>{"Tổng chi phí lộ trình học: " + (fee || "") }</li>
                <li>{"Tổng thời gian lộ trình học: " + (duration && duration.Output || "")}</li>
                <li>{"Các khoá học này ở các khung thời gian: " + (frameRemain && frameRemain.frame_remain || "")}</li>
              </ul>
            </p>
          </Row>;
    } else if (bothStatus == 202 && bothMessage == 'frameRemain_Fulltime') {
      let lan = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => el.ExceptionType == 'Lan');
      let fee = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => el.ExceptionType == 'Fee');
      fee = fee && (new Intl.NumberFormat('it-IT').format(fee.Output) + " VNĐ") || '';

      let duration = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => el.ExceptionType == 'Duration');
      let frameRemain = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => el.ExceptionType == 'Frame_Remain');
      return <Row>
            <p style={{width: "100%"}}>
              {"Chúng tôi đề xuất đến bạn những khoá học phù hợp với nghề nghiệp, hình thức học." + 
                "Nhưng có sự chênh lệch so với vài tiêu chí như:"
              }
              <ul>
                <li>{"Ngôn ngữ các khoá học này là: " + (lan && lan.lan_remain)}</li>
                <li>{"Tổng chi phí lộ trình học: " + (fee || "")}</li>
                <li>{"Tổng thời gian lộ trình học: " + (duration && duration.Output || "")}</li>
                <li>{"Các khoá học này ở các khung thời gian: " + (frameRemain && frameRemain.frame_remain || "")}</li>
              </ul>
            </p>
          </Row>;
    } else if (bothStatus == 400 && bothMessage == 'no courses') {
        return <Row>
              <p style={{width: "100%"}}>
                {"Hệ thống đang cập nhật các khoá học liên quan đến skills nghề nghiệp yêu cầu."
                }<br/><br/>
                {"Bạn có thể tham khảo 5 job liên quan đến ghề nghiệp bạn đang định hướng, các job bao gồm: "} <br/>
                {bothException && bothException[0] && bothException[0].Job_offer || ""}
              </p>
            </Row>;
    } else if (bothStatus == 200 && bothMessage == 'PASS' && bothException && bothException.some( el => !!el.Balance)) {
        let fee = bothException.find(el => el.ExceptionType == 'Fee');
        fee = fee && (new Intl.NumberFormat('it-IT').format(fee.Output) + " VNĐ") || '';
        let duration = bothException.find(el => el.ExceptionType == 'Duration');
        return <Row>
              <p style={{width: "100%"}}>
                {"Chúng tôi đề xuất đến bạn những khoá học phù hợp với nghề nghiệp, hình thức học, ngôn ngũ bạn biết."
                }<br/><br/>
                {"Nhưng có sự chênh lệch so với vài tiêu chí như:"} <br/>
                <ul>
                  {/* <li>{"Tổng chi phí lộ trình học: " + (fee && fee.Output)}</li> */}
                  <li>{"Tổng chi phí lộ trình học: " + fee}</li>
                  <li>{"Tổng thời gian lộ trình học: " + (duration && duration.Output || "")}</li>
                </ul>
              </p>
            </Row>;
    } else if (bothStatus == 402 && bothMessage == 'Lan' && courseArrays[0]) {
      let lan = bothNgoaiLe.ExceptionDetail && bothNgoaiLe.ExceptionDetail.find(el => el.ExceptionType == 'Lan');
      return <Row>
            <p style={{width: "100%"}}>
              {"Chúng tôi đề xuất đến bạn những khoá học phù hợp với nghề nghiệp, hình thức học, thời gian học và chi phí."
              }<br/><br/>
              {"Nhưng có sự chênh lệch so với vài tiêu chí như ngôn ngữ học."} <br/>
              <ul>
                <li>{"Ngôn ngữ các khoá học này là: " + (lan && lan.lan_remain)}</li>
              </ul>
            </p>
          </Row>;
    } else if (method === MethodEnum.ONLINE && courseOnlineArrays && !courseOnlineArrays[0] && courseOfflineArrays
                && courseOfflineArrays[0]) {
        return <Row>
              <p style={{width: "100%"}}>
                {"Không có khoá học Online phù hợp với tiêu chí của bạn."
                }<br/><br/>
                {"Bạn có thể tham khảo 5 job liên quan đến nghề nghiệp bạn đang đinh hướng, các job bao gồm: "
                  + (bothException && bothException[0] && bothException[0].Job_offer || "")}
              </p>
            </Row>;
    } else if (method === MethodEnum.OFFLINE && courseOfflineArrays && !courseOfflineArrays[0] && courseOnlineArrays
                && courseOnlineArrays[0]) {
        return <Row>
              <p style={{width: "100%"}}>
                {"Không có khoá học Offline phù hợp với tiêu chí của bạn."
                }<br/><br/>
                {"Bạn có thể tham khảo 5 job liên quan đến nghề nghiệp bạn đang định hướng, các job bao gồm: "
                  + (bothException && bothException[0] && bothException[0].Job_offer || "")}
              </p>
            </Row>;
    } else if (!courseOfflineArrays[0] && !courseOnlineArrays[0]) {
        return <Row>
              <p style={{width: "100%"}}>
                {"Không có khoá học " + (method === MethodEnum.ONLINE ? "Online" : "Offline") + " phù hợp với tiêu chí của bạn."
                }<br/><br/>
                {"Bạn có thể tham khảo 5 job liên quan đến nghề nghiệp bạn đang đinh hướng, các job bao gồm: "
                  + (bothException && bothException[0] && bothException[0].Job_offer || "")}
              </p>
            </Row>;
    }
    return "";
  }

  return (
    <Row>
      <Col md={9}>
        <Card>
          <Modal
            isOpen={openGoogleForm}
            toggle={() => {
              setOpenGoogleForm(false);
            }}
            centered
            className="rating-modal"
          >
            <ModalHeader>ĐÁNH GIÁ VỀ HỆ THỐNG TƯ VẤN</ModalHeader>
            <ModalBody>
              <p>Chúng tôi rất mong bạn tham gia khảo sát, từ đó chúng tôi có thể cải tiến hệ thống tư vấn tốt hơn trong tương lai.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenGoogleForm(false);
                }}
                style={{ margin: "0 auto" }}
              >
                Từ chối khảo sát
              </Button>
              <Button
                color="primary"
                onClick={(e) => {
                  window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSc_YfWh5VU5TRhu7bC0tluDmMB6xdB-YeXr5dlrGHT3KMqZYg/viewform',
                    '_blank' // <- This is what makes it open in a new window.
                  );
                  e.preventDefault();
                  setOpenGoogleForm(false);
                }}
                style={{ margin: "0 auto" }}
              >
                Tham gia khảo sát
              </Button>

            </ModalFooter>
          </Modal>
          <Modal
            isOpen={openRating}
            toggle={() => {
              setOpenRating(false);
            }}
            centered
            className="rating-modal"
          >
            <ModalHeader>Evaluate Recommendation Systems</ModalHeader>
            <ModalBody>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSc_YfWh5VU5TRhu7bC0tluDmMB6xdB-YeXr5dlrGHT3KMqZYg/viewform" target="_blank">Google Form</a>
              <br/>
              <br/>
              <Rating
                className="d-flex justify-content-between"
                initialRating={0}
                stop={10}
                onChange={(value) => {
                  console.log(value);
                  setRating(value);
                }}
                emptySymbol={
                  <span className="text-muted opacity-3">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ fontSize: "32px" }}
                    />
                  </span>
                }
                fullSymbol={
                  <span className="text-warning">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ fontSize: "32px" }}
                    />
                  </span>
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  http.post("/rating", {
                    Rating: rating,
                  });
                  toastSuccessText("Thanks for your rating");
                  setOpenRating(false);
                }}
                style={{ margin: "0 auto" }}
              >
                Submit
              </Button>
            </ModalFooter>
          </Modal>

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
            {showStatusMessage() }
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
                            ({item.peopleRating ? item.peopleRating : 0})
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
                              {item.feeVND == 0 ? "Free" : new Intl.NumberFormat('it-IT').format(item.feeVND) + " VNĐ"}
                            </Button>
                            <Link
                              to={`course/${item.courseID}`}
                              className="btn-wide mb-2 btn-icon d-inline-block btn btn-outline-primary"
                            >
                              <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                              Details
                            </Link>
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
          </CardBody>
          <CardBody>
            <CardTitle className="text-danger">Missing Skill</CardTitle>
            {/* <Row>
              <Col md={12}>
                <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Provided skills
                </Label>
              </Col>
            </Row> */}
            {/* <Row>
              <Col md={12}>
                {providedSkills.map((skill, index) => (
                  <FormGroup className="ml-4" key={index}>
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
            </Row> */}
            {/* <Row>
              <Col md={12}>
                <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Provided skills
                </Label>
                <div>{missingSkills.join(", ")}</div>
              </Col>
            </Row> */}
            <Row>
              <Col md={12}>
                <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Courses provided skills
                </Label>
                <div>
                  {coursesProvidedKkills()}
                </div>
              </Col>

            </Row>
            <Row>
              <Col md={12}>
                <Label className="font-weight-bold text-uppercase text-secondary mt-3">
                  Courses unprovided skills
                </Label>
                <div>
                  {lstSkillNotProvider()}
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
