import React, { Fragment, useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import "../CourseDetail/style.scss";
import { FormGroup, Label, CustomInput, Input, Col, Form, FormText, Button } from "reactstrap";

import avatar1 from "../../assets/utils/images/avatars/2.jpg";
import course1 from "../../assets/utils/images/courses/course-1.jpg";
import image1 from "../../assets/images/slider-img1.jpg";
import image2 from "../../assets/images/slider-img2.jpg";
import image3 from "../../assets/images/slider-img3.jpg";
import { useHistory, useParams } from "react-router";
import http from "../../redux/utils/http";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import {
  GetAllLanguageAction,
  GetAllTechnologyAction,
  GetFreeTimeAction,
  GetAllMajorAction,
} from "../../redux/masterdata/masterDataAction";
import { updateAction } from "../../redux/actions/account/accountAction";
import { toastErrorText, toastSuccessText } from "../../helpers/toastify";

export default function EditProfile() {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector((state) => state.accountReducer.user);
  const [DTO, setDTO] = useState({
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
    fieldOfStudy: "",
    address1: "",
    cities: [],
    districts: [],
    wards: [],
  });
  const { lsLanguage, lsFreeTime, lsTechnology, lsMajor } = useSelector((state) => state.masterdataReducer);

  const [techSkill, settechSkill] = useState([])
  const [language, setlanguage] = useState([])
  const [freeTime, setFreeTime] = useState([])
  const [lstFeeMax, setLstFeeMax] = useState([
          'Less 5 millions VND',
          'From 5 to 15 millions VND',
          'From 15 to 30 millions VND',
          'From 30 to 50 millions VND',
      ]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
      const updateCities = async () => {
          const {data} = await axios.get("https://vapi.vnappmob.com/api/province/");
          // setCities(data.results);
          setDTO(pre => ({ ...pre, cities: data.results }));
      }
      updateCities();

  }, []);

  useEffect(() => {
      setDTO((prev) => {
        return {...prev, technologySkill: [{techName: "API"}, {techName:"AI"}],
          feeMax: auth.feeMax,
          learnerLevel: auth.learnerLevel,
          futureSelfDevelopment: auth.futureSelfDevelopment,
          jobNow: auth.jobNow,
          address1: auth.address1 || '',
          fieldOfStudy: auth.fieldOfStudy
        }
      });
    if(auth.freeTime) {
        let freeTimes = auth.freeTime.split('|');
        setFreeTime(freeTimes);
    }
    if (auth.language) {
      setlanguage(auth.language.split(', ').map((el) => ({lanName: el})));
    }
    if (auth.technologySkill) {
      settechSkill(auth.technologySkill.split(', ').map((el) => ({techName: el})));
    }
  }, [auth]);
  useEffect(() => {
    if (auth.address && DTO.cities) {
      let address = auth.address.split(', ');
      if (address[0]) {
        let cityIndex = DTO.cities.findIndex(el => el.province_name.indexOf(address[0]) !== -1);
        if (cityIndex !== -1) {
          getDistricts(DTO.cities[cityIndex].province_id, {city_id: cityIndex, city: DTO.cities[cityIndex].province_name, district_text: address[1], ward_text: address[2]});
        }
      }
    }
  }, [DTO.cities]);

  useEffect(() => {
    dispatch(GetAllLanguageAction());
    dispatch(GetAllTechnologyAction());
    dispatch(GetFreeTimeAction());
    dispatch(GetAllMajorAction());
  }, []);

  const getDistricts = async (id, params) => {
      const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/district/${id}`);
      if (params.district_text && data.results) {
        let districtIndex = data.results.findIndex(el => el.district_name.indexOf(params.district_text) !== -1);
        if (districtIndex !== -1) {
          getWards(data.results[districtIndex].district_id, { ...params, 
            district_id: districtIndex,
            district: data.results[districtIndex].district_name,
            districts: data.results});
          return;
        } else {
          setDTO(pre => ({ ...pre, ...params, districts: data.results}));
          return;
        }
      }
      setDTO(pre => ({ ...pre, ...params, districts: data.results}));
      
  };

  const getWards = async (id, params) => {
      const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${id}`);
      if (params.ward_text && data.results) {
        let wardIndex = data.results.findIndex(el => el.ward_name.indexOf(params.ward_text) !== -1);
        if (wardIndex !== -1) {
          setDTO(pre => ({ ...pre, ...params, wards: data.results, ward: data.results[wardIndex].ward_name, ward_id: wardIndex}));
          return;
        } else {
          setDTO(pre => ({ ...pre, ...params, wards: data.results}));
          return;
        }
      }

      // setWards(data.results);
      setDTO(pre => ({ ...pre, ...params, wards: data.results }));
  }

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

  function onClickUpdate() {
    if(checkSecondStep() == false) {
      return;
    }
    let postdata = {
      learnerID: auth.learnerID,
      address: removeFirst(DTO.city, 'city') + ', ' + removeFirst(DTO.district, 'district') + ', ' + removeFirst(DTO.ward, 'ward'),
      address1: DTO.address1,
      learnerLevel: DTO.learnerLevel,
      language: language.map(({lanName}) => lanName).join(', '),
      jobNow: DTO.jobNow,
      technologySkill: techSkill.map(({techName}) => techName).join(', '),
      fieldOfStudy: DTO.fieldOfStudy,
      feeMax: DTO.feeMax,
      freeTime: freeTime.join('|'),
      futureSelfDevelopment: DTO.futureSelfDevelopment,
    }
    dispatch(updateAction(postdata)).then(() => {
      toastSuccessText("Update success!");
    });
  }

  const checkSecondStep = () => {
    const errors = [];
    console.log(language);
    if(!(language && language.length > 0)) {
      errors.push("Please choose at least one language you know");
    }
    if (!(techSkill && techSkill.length > 0)) {
      errors.push("Please choose at least one technology skill you know");
    }

    errors.forEach((err) => {
      toastErrorText(err);
    });

    return errors.length == 0;
  }
  return (
    <>
      <ThemeOptions />
      <AppHeader />
      <br/><br/><br/><br/>
      {/* < div className="app-main"> */}
      {/* <AppSidebar /> */}
      {/* <div className="app-main__outer"> */}
      <div className="app-main__inner card-body">
        <div className="form-wizard-content">
            <Form>
                <FormGroup row>
                    <Label for="exampleEmail" sm={2}>
                        What do you do?
                    </Label>
                    <Col sm={10}>
                        <Input type="select" value={DTO.jobNow} onChange={(e) => setDTO({ ...DTO, jobNow: e.target.value })}>
                            <option value={""}>Not employed</option>
                            <option value={"work"}>Employed full-time</option>
                            <option value={"study"}>Student full-time</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2}>
                        What is your major?
                    </Label>
                    <Col sm={10}>
                        <Input type="select" value={DTO.fieldOfStudy} onChange={(e) => setDTO({ ...DTO, fieldOfStudy: e.target.value })}>
                            <option value={""}>Please choose your major</option>
                            {lsMajor.length && lsMajor.map(({subjectName, subjectID}, index) => (<option key={subjectID} value={subjectID}>{subjectName}</option>))}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="examplePassword" sm={2}>
                        Which of the following best describes the highest level of formal education that you've completed?
                    </Label>
                    <Col sm={10}>
                        <Input type="select" value={DTO.learnerLevel} onChange={(e) => setDTO({ ...DTO, learnerLevel: e.target.value })}>
                            <option value={""}>Please choose your degree</option>
                            <option value={"Secondary school"}>Secondary school</option>
                            <option value={"Some college/university study without earning a degree Associate degree (A.A., A.S., etc.)"}>Some college/university study without earning a degree Associate degree (A.A., A.S., etc.)</option>
                            <option value={"Bachelor’s degree (B.A., B.S., B.Eng., etc.)"}>Bachelor’s degree (B.A., B.S., B.Eng., etc.)</option>
                            <option value={"Master’s degree (M.A., M.S., M.Eng., MBA, etc.)"}>Master’s degree (M.A., M.S., M.Eng., MBA, etc.)</option>
                            <option value={"Professional degree (JD, MD, etc.)"}>Professional degree (JD, MD, etc.))</option>
                            <option value={"Other doctoral degree (Ph.D., Ed.D., etc.)"}>Other doctoral degree (Ph.D., Ed.D., etc.)</option>
                            <option value={"Something else"}>Something else</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelect" sm={2}>
                        Where do you live?
                    </Label>
                    <Col sm={3}>
                        <Input type="select" value={DTO.city_id} onChange={(e) => {
                            if (e.target.value === "-1") { 
                                getDistricts(0, { ...DTO, city_id: e.target.value, city: "" });
                            } else {
                                getDistricts(DTO.cities[e.target.value].province_id, { ...DTO, city_id: e.target.value, city: DTO.cities[e.target.value].province_name });
                                
                            }
                        }}>
                            <option value={-1} key={0}>Please choose City</option>
                            {DTO.cities.length && DTO.cities.map(({province_name, province_id}, index) => (<option key={province_id} value={index}>{province_name}</option>))}
                        </Input>
                    </Col>
                    <Col sm={3}>
                        <Input type="select" value={DTO.district_id} onChange={(e) => {
                            if (e.target.value === "-1") { 
                                getWards(0, { ...DTO, district_id: e.target.value, district: "" });
                            } else {
                                getWards(DTO.districts[e.target.value].district_id, { ...DTO, district_id: e.target.value, district: DTO.districts[e.target.value].district_name });
                            }
                        }}>
                            <option value={-1}>Please choose District</option>
                            {DTO.districts.length && DTO.districts.map(({district_id, district_name}, index) => (<option key={district_id} value={index}>{district_name}</option>))}
                            
                        </Input>
                    </Col>
                    <Col sm={3}>
                        <Input type="select" value={DTO.ward_id} onChange={(e) => {
                            if (e.target.value === "-1") { 
                                setDTO({ ...DTO, ward_id: e.target.value, ward: "" })
                            } else {
                                setDTO({ ...DTO, ward_id: e.target.value, ward: DTO.wards[e.target.value].ward_name })
                            }
                        }}>
                            <option value={-1}>Please choose Ward</option>
                            {DTO.wards.length && DTO.wards.map(({ward_id, ward_name}, index) => (<option key={ward_id} value={index}>{ward_name}</option>))}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelectMulti" sm={2}>
                        Số nhà, đường
                    </Label>
                    <Col sm={10}>
                        <Input type="text" value={DTO.address1} onChange={(e) => setDTO({...DTO, address1: e.target.value})} placeholder="ví dụ: 38, đường số 6" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelectMulti" sm={2}>
                        What languages do you know?
                    </Label>
                    <Col sm={10}>
                        <Select isMulti components={makeAnimated()}
                            closeMenuOnSelect={false}
                            getOptionLabel={option => option.lanName}
                            getOptionValue={option => option.lanName}
                            options={lsLanguage} className="basic-multi-select" classNamePrefix="select"
                            value={language}
                            onChange={(value) => {
                                setlanguage(value);
                            }}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelectMulti" sm={2}>
                        What skills do you know?
                    </Label>
                    <Col sm={10}>
                        <Select isMulti components={makeAnimated()}
                            closeMenuOnSelect={false}
                            getOptionLabel={option => option.techName}
                            getOptionValue={option => option.techName}
                            options={lsTechnology} className="basic-multi-select" classNamePrefix="select"
                            value={techSkill}
                            onChange={(value) => {
                                settechSkill(value);
                            }} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="examplePassword" sm={2}>
                        How much can you spend on courses?
                    </Label>
                    <Col sm={10}>
                        <Input type="select" value={DTO.feeMax} onChange={(e) => setDTO({ ...DTO, 
                                feeMax: e.target.value, feeMaxText: lstFeeMax[e.target.value] })}>
                            <option value={""}>Please choose Fee</option>
                            {lstFeeMax.map((value, index) => (<option key={value} value={index}>{value}</option>))}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelectMulti" sm={2}>
                        What time is right for you, if we have an offline courses?
                    </Label>
                    <Col sm={10}>
                        <Select isMulti components={makeAnimated()}
                            closeMenuOnSelect={false}
                            getOptionLabel={option => option}
                            getOptionValue={option => option}
                            options={lsFreeTime} className="basic-multi-select" classNamePrefix="select"
                            value={freeTime}
                            onChange={(value) => {
                                setFreeTime(value);
                            }}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="examplePassword" sm={2}>
                        Which of the following describes your future self-development?
                    </Label>
                    <Col sm={10}>
                        <Input type="select" value={DTO.futureSelfDevelopment} onChange={(e) => setDTO({ ...DTO, futureSelfDevelopment: e.target.value })}>
                            <option value={""}>Please choose your future self-development</option>
                            <option value={"Data or business analyst"}>Data or business analyst</option>
                            <option value={"Data scientist or machine learning specialist"}>Data scientist or machine learning specialist</option>
                            <option value={"Database administrator"}>Database administrator</option>
                            <option value={"Designer"}>Designer</option>
                            <option value={"Developer, back-end"}>Developer, back-end</option>
                            <option value={"Developer, desktop or enterprise applications"}>Developer, desktop or enterprise applications</option>
                            <option value={"Developer, embedded applications or devices"}>Developer, embedded applications or devices</option>
                            <option value={"Developer, front-end"}>Developer, front-end</option>
                            <option value={"Developer, full-stack"}>Developer, full-stack</option>
                            <option value={"Developer, game or graphics"}>Developer, game or graphics</option>
                            <option value={"Developer, mobile"}>Developer, mobile</option>
                            <option value={"Developer, QA or test"}>Developer, QA or test</option>
                            <option value={"DevOps specialist"}>DevOps specialist</option>
                            <option value={"Engineer, data"}>Engineer, data</option>
                            <option value={"Engineer, site reliability"}>Engineer, site reliability</option>
                            <option value={"Engineering manager"}>Engineering manager</option>
                            <option value={"Marketing or sales professional"}>Marketing or sales professional</option>
                            <option value={"Product manager"}>Product manager</option>
                            <option value={"Scientist"}>Scientist</option>
                            <option value={"Senior Executive (C-Suite, VP, etc.)"}>Senior Executive (C-Suite, VP, etc.)</option>
                            <option value={"System administrator"}>System administrator</option>
                        </Input>
                    </Col>
                </FormGroup>
            </Form>

            <div className="text-center">
                <Button color="success" size="lg" className="btn-shadow btn-wide" onClick={() => onClickUpdate()}>
                    Update
                </Button>
            </div>
            <br />
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
