import React, {useRef} from "react";
import { Col, Row, FormGroup, Label, Input, Card, CardBody } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ModalFaded from "../../Pages/Components/Modal/Examples/ModalFaded";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from "react-router-dom";
import { toastErrorText } from "../../helpers/toastify";
import { recommendCourses } from "../../redux/actions/courses/courses";


function RecommendationHandler() {
  const { masterdataReducer, accountReducer } = useSelector((state) => state);
  const { lsJob } = masterdataReducer;

  const history = useHistory();
  const dispatch = useDispatch();

  const recommendationInfo = useRef({
    occupation: "",
    form: "",
    month: "12",
    typeFilter: "progress",
  });

  const submit = () => {
    const errs = [];
    const { occupation, form, month, typeFilter } = recommendationInfo.current;
    const {email} = accountReducer.user;
    // validation
    if (!occupation) {
      errs.push("Occupation is required");
    }
    if (!email){
      history.push("/login");
      return;
    }

    // fire errs message 
    if (errs.length){
      errs.forEach((err) => {
        toastErrorText(err);
      });
    } else { // call api to RS server
      localStorage.setItem("Form", form);
      dispatch(recommendCourses(occupation, form, month, email, typeFilter));
    }
  }

  return (
    <Card>
      <CardBody>
        <Row form>
          <Col md={3}>
            <FormGroup>
              <Label for="exampleName">Vị trí nghề nghiệp</Label>
              <Select
                components={makeAnimated()}
                closeMenuOnSelect={false}
                getOptionLabel={(option) => option.jobTitle}
                getOptionValue={(option) => option.jobTitle}
                options={lsJob}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {
                  recommendationInfo.current.occupation = e.jobTitle;
                }}
              />
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for="exampleName">Hình thức học</Label>
              <Input
                type="select"
                onChange={(e) => {
                  recommendationInfo.current.form = e.target.value;
                }}
              >
                <option value={""}>Chọn hình thức học</option>
                <option value={"online"}>Online</option>
                <option value={"offline"}>Offline</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md={2}>
            <FormGroup>
              <Label for="exampleName">Thời gian học</Label>
              <Input
                type="select"
                onChange={(e) => {
                  recommendationInfo.current.month = e.target.value;
                }}
              >
                <option value={"00"}>Chọn tháng</option>
                <option value={"01"}>1 Month</option>
                <option value={"02"}>2 Months</option>
                <option value={"03"}>3 Months</option>
                <option value={"04"}>4 Months</option>
                <option value={"05"}>5 Months</option>
                <option value={"06"}>6 Months</option>
                <option value={"07"}>7 Months</option>
                <option value={"08"}>8 Months</option>
                <option value={"09"}>9 Months</option>
                <option value={"10"}>10 Months</option>
                <option value={"11"}>11 Months</option>
                <option value={"12"}>12 Months</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md={2}>
            <FormGroup>
              <Label for="exampleName">Hình thức tư vấn</Label>
              <Input
                type="select"
                onChange={(e) => {
                  recommendationInfo.current.typeFilter = e.target.value;
                }}
              >
                <option value={"progress"}>Follow the process</option>
                <option value={"top"}>Top 10 courses</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md={2}>
            <FormGroup>
              <ModalFaded submit={submit}></ModalFaded>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default RecommendationHandler;