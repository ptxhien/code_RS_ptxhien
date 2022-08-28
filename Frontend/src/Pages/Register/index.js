import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import {Redirect} from "react-router-dom";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import MultiStep from "../Forms/Elements/Wizard/Wizard";
import Step1 from "./Steps/step1";
import Step2 from "./Steps/step2";
import Step3 from "./Steps/step3";
import {
  GetAllLanguageAction,
  GetAllTechnologyAction,
  GetFreeTimeAction,
  GetAllMajorAction,
} from "../../redux/masterdata/masterDataAction";
import { registerAction } from "../../redux/actions/account/accountAction";
import { toastErrorText } from "../../helpers/toastify";

export default function Register() {
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    initialSlide: 0,
    autoplay: true,
    adaptiveHeight: true,
  };

  const dispatch = useDispatch();
  const accountReducer = useSelector(state => state.accountReducer);

  const [DTO, setDTO] = useState({
    email: "",
    password: "",
    fullname: "",
    gender: "Male",
    city_id: "",
    city: "",
    district_id: "",
    district: "",
    ward_id: "",
    ward: "",
    learnerLevel: "",
    language: "",
    jobNow: "",
    technologySkill: "",
    feeMax: "",
    feeMaxText: "",
    freeTime: "",
    futureSelfDevelopment: "",
    major: "",
    fieldOfStudy: "",
    cities: [],
    districts: [],
    wards: [],
  });
  const steps = [
    {
      name: "Account Information",
      component: <Step1 DTO={DTO} setDTO={setDTO} />,
      shouldGoNext: false,
      errors: [],
    },
    {
      name: "Personal Information",
      component: <Step2 DTO={DTO} setDTO={setDTO} />,
      shouldGoNext: false,
      errors: [],
    },
    {
      name: "Finish Wizard",
      component: <Step3 DTO={DTO} onClickRegister={onClickRegister} />,
      shouldGoNext: true,
    },
  ];
  
  const [validSteps, setValidSteps] = useState([
    { shouldGoNext: false, errors: [] },
    { shouldGoNext: false, errors: [] },
    { shouldGoNext: true, errors: [] },
  ]);

  function removeFirst(str, type) {
    let index = -1;
    let searchstr = '';
    if(type == 'city') {
      searchstr = 'Thành phố ';
      index = str.indexOf(searchstr);
      if(index !== 0) {
        searchstr = 'Tỉnh ';
        index = str.indexOf(searchstr);
      }
    }
    if(type == 'district') {
      searchstr = 'Thành phố ';
      index = str.indexOf(searchstr);
      if(index !== 0) {
        searchstr = 'Huyện ';
        index = str.indexOf(searchstr);
      }
      if(index !== 0) {
        searchstr = 'Quận ';
        index = str.indexOf(searchstr);
      }
      if(index !== 0) {
        searchstr = 'Thị xã ';
        index = str.indexOf(searchstr);
      }
    }
    if(type == 'ward') {
      searchstr = 'Phường ';
      index = str.indexOf(searchstr);
      if(index !== 0) {
        searchstr = 'Xã ';
        index = str.indexOf(searchstr);
      }
      if(index !== 0) {
        searchstr = 'Thị trấn ';
        index = str.indexOf(searchstr);
      }
    }
    if (index === 0) {
      return str.slice(searchstr.length);
    }
    return str;
  }
  useEffect(() => {
    dispatch(GetAllLanguageAction());
    dispatch(GetAllTechnologyAction());
    dispatch(GetFreeTimeAction());
    dispatch(GetAllMajorAction());
  }, []);

  function onClickRegister() {
    console.log(DTO);
    let postdata = {
      email: DTO.email,
      password: DTO.password,
      fullname: DTO.fullname,
      gender: DTO.gender,
      address: removeFirst(DTO.city, 'city') + ', ' + removeFirst(DTO.district, 'district') + ', ' + removeFirst(DTO.ward, 'ward'),
      learnerLevel: DTO.learnerLevel,
      language: DTO.language.map(({lanName}) => lanName).join(', '),
      jobNow: DTO.jobNow,
      technologySkill: DTO.technologySkill.map(({techName}) => techName).join(', '),
      fieldOfStudy: DTO.fieldOfStudy && DTO.fieldOfStudy.map(({techName}) => techName).join(', '),
      feeMax: DTO.feeMax,
      freeTime: DTO.freeTime,
      futureSelfDevelopment: DTO.futureSelfDevelopment,
      major: DTO.major
    }
    dispatch(registerAction(postdata));
  }
  
  const checkFirstStep = () => {
    const errors = [];

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(DTO.email)){
      errors.push("Email is not valid!");
    }
    if (!/^(?=.*?[a-z|A-Z|0-9]).{8,}$/g.test(DTO.password)) {
      errors.push("Password must have at least 8 characters");
    }
    if (!DTO.fullname.trim()) {
      errors.push("Invalid name");
    }
    
    if (errors.length) {
      return {
        shouldGoNext: false,
        errors,
      };
    }

    return {shouldGoNext: true, errors: []};
  }

  const checkSecondStep = () => {
    const errors = [];
    
    if(!DTO.language) {
      errors.push("Please choose at least one language u know");
    }
    if (!DTO.technologySkill) {
      errors.push("Please choose at least one technology skill u know");
    }

    if (errors.length) {
      return {
        shouldGoNext: false,
        errors,
      };
    }

    return { shouldGoNext: true, errors: [] };
  }

  useEffect(() => {
    const newValidSteps = [...validSteps];
    newValidSteps[0] = checkFirstStep();
    newValidSteps[1] = checkSecondStep();
    setValidSteps(newValidSteps);

  }, [DTO]);

  useEffect(() =>{
    if (accountReducer.error){
      toastErrorText(accountReducer.error);
    }
  }, [accountReducer]);

  return (
    <Fragment>
      {accountReducer.isLogged ? 
      (<Redirect to="/"></Redirect>) : 
      (<div className="h-100">
        <Row className="h-100 no-gutters">
          <Col lg="7" md="12" className="h-100">
            <Card className="main-card mb-3 h-100 ">
              <CardBody>
                <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                  <div className="app-logo" />
                  <h4>
                    <div>Welcome,</div>
                    <span>
                      It only takes a{" "}
                      <span className="text-success">few seconds</span> to
                      create your account
                    </span>
                  </h4>
                </Col>
                <MultiStep showNavigation={true} steps={steps} validSteps={validSteps} />
              </CardBody>
            </Card>
          </Col>
          <Col lg="5" className="d-lg-flex d-xs-none">
            <div className="slider-light">
              <Slider {...settings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                  <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg3 + ")",
                    }}
                  />
                  <div className="slider-content">
                    <h3>Scalable, Modular, Consistent</h3>
                    <p>
                      Easily exclude the components you don't require.
                      Lightweight, consistent Bootstrap based styles across all
                      elements and components
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
        </Row>
      </div>)}
    </Fragment>
  );
}
