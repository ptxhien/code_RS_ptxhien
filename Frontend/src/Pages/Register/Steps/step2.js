import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Combobox } from "react-widgets";
import { FormGroup, Label, CustomInput, Input, Col, Form, FormText } from "reactstrap";
import { GetAllLanguageAction } from "../../../redux/masterdata/masterDataAction";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";

const removeAccent = (str = "") => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function WizardStep2({ DTO, setDTO }) {
    const { lsLanguage, lsFreeTime, lsTechnology, lsMajor } = useSelector((state) => state.masterdataReducer);

    const [techSkill, settechSkill] = useState([])
    const [language, setlanguage] = useState([])
    const [freeTime, setfreeTime] = useState([])
    const [lstFeeMax, setLstFeeMax] = useState([
            'Less 5 millions VND',
            'From 5 to 15 millions VND',
            'From 15 to 30 millions VND',
            'From 30 to 50 millions VND',
        ]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [address, setaddress] = useState({
        city: "",
        ward: "",
        district: ""
    });
    const [isFirstTime, setIsFirstTime] = useState(true);

    useLayoutEffect(() => {
        const updateCities = async () => {
            const {data} = await axios.get("https://vapi.vnappmob.com/api/province/");
            // setCities(data.results);
            setDTO({ ...DTO, cities: data.results });
        }
        updateCities();
    }, []);

    useEffect(() => {
        // if (!(address.ward + address.district + address.city)){
        //     setDTO({ ...DTO, address: "" });
        //     return;
        // }
        // const castedAddress = removeAccent(address.ward) + ", " + removeAccent(address.district) + ", " + removeAccent(address.city);
        // setDTO({ ...DTO, address: castedAddress });
    }, [address]);
    useEffect(() => {
        // const castedSkills = techSkill.map(({ techName }) => techName);
        // const str = castedSkills.join(", ");
        // setDTO({ ...DTO, technologySkill: str });
    }, [techSkill])

    useEffect(() => {
        // const castedLanguages = language.map(({lanName}) => lanName);
        // const str = castedLanguages.join(", ");
        // setDTO({ ...DTO, language: str });
    }, [language])

    useEffect(() => {
        // const str = freeTime.join(", ")
        // console.log(freeTime, str);
        // lsFreeTime.filter((v) => v.isFixed)
        // setDTO({ ...DTO, freeTime: lsFreeTime[2] });
        // console.trace();
        // console.log(DTO)
    }, [DTO])

    const getDistricts = async (id, params) => {
        const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/district/${id}`);
        setDTO({ ...DTO, ...params, districts: data.results});
        
    };

    const getWards = async (id, params) => {
        const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${id}`);
        // setWards(data.results);
        setDTO({ ...DTO, ...params, wards: data.results });
    }
    return (
        <Fragment>
            <div className="form-wizard-content">
                <Form>
                    <FormGroup row>
                        <Label for="exampleEmail" sm={2}>
                            What do you do?
                        </Label>
                        <Col sm={10}>
                            <Input type="select" value={DTO.jobNow} onChange={(e) => setDTO({ ...DTO, jobNow: e.target.value })}>
                                <option value={""}>Not employed</option>
                                <option value={"Work"}>Employed full-time</option>
                                <option value={"Study"}>Student, full-time</option>
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
                            What languages do you know?
                        </Label>
                        <Col sm={10}>
                            <Select isMulti components={makeAnimated()}
                                closeMenuOnSelect={false}
                                getOptionLabel={option => option.lanName}
                                getOptionValue={option => option.lanName}
                                options={lsLanguage} className="basic-multi-select" classNamePrefix="select"
                                value={DTO.language}
                                onChange={(value) => {
                                    setDTO({ ...DTO, language: value })
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
                                value={DTO.technologySkill}
                                onChange={(value) => {
                                    setDTO({ ...DTO, technologySkill: value });
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
                                value={DTO.freeTime}
                                onChange={(value) => {
                                    setDTO({ ...DTO, freeTime: value })
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
            </div>
        </Fragment>
    )
}
