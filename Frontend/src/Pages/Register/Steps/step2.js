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
    const { lsLanguage, lsFreeTime, lsTechnology } = useSelector((state) => state.masterdataReducer);

    const [techSkill, settechSkill] = useState([])
    const [language, setlanguage] = useState([])
    const [freeTime, setfreeTime] = useState([])

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
            setCities(data.results);
        }
        updateCities();
    }, []);

    useEffect(() => {
        if (!(address.ward + address.district + address.city)){
            setDTO({ ...DTO, address: "" });
            return;
        }
        const castedAddress = removeAccent(address.ward) + ", " + removeAccent(address.district) + ", " + removeAccent(address.city);
        setDTO({ ...DTO, address: castedAddress });
    }, [address]);

    useEffect(() => {
        const castedSkills = techSkill.map(({ techName }) => techName);
        const str = castedSkills.join(", ");
        setDTO({ ...DTO, technologySkill: str });
    }, [techSkill])

    useEffect(() => {
        const castedLanguages = language.map(({lanName}) => lanName);
        const str = castedLanguages.join(", ");
        setDTO({ ...DTO, language: str });
    }, [language])

    useEffect(() => {
        const str = freeTime.join(", ")        
        setDTO({ ...DTO, freeTime: str });
    }, [freeTime])

    const getDistricts = async (id) => {
        const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/district/${id}`);
        setDistricts(data.results);
    };

    const getWards = async (id) => {
        const {data} = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${id}`);
        setWards(data.results);
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
                                <option value={"work"}>I am working</option>
                                <option value={"study"}>I am a student</option>
                                <option value={""}>I am a freelancer</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="examplePassword" sm={2}>
                            What is your degree?
                        </Label>
                        <Col sm={10}>
                            <Input type="select" value={DTO.learnerLevel} onChange={(e) => setDTO({ ...DTO, learnerLevel: e.target.value })}>
                                <option value={""}>Please choose your degree</option>
                                <option value={"College"}>College</option>
                                <option value={"University"}>University</option>
                                <option value={"Bachelor"}>Bachelor</option>
                                <option value={"Master"}>Master</option>
                                <option value={"Docter of Phylosophy (Ph.D)"}>Docter of Phylosophy (Ph.D)</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" sm={2}>
                            Where do you live?
                        </Label>
                        <Col sm={3}>
                            <Input type="select" onChange={(e) => {
                                console.log(cities[e.target.value].province_name)
                                if (e.target.value === "-1") { 
                                    setaddress({city: "", district: "", ward: ""});
                                    getDistricts(0);
                                } else {
                                    setaddress({ city: cities[e.target.value].province_name, district: "", ward: "" });
                                    getDistricts(cities[e.target.value].province_id);
                                }
                            }}>
                                <option value={-1} key={0}>Please choose City</option>
                                {cities.length && cities.map(({province_name, province_id}, index) => (<option key={province_id} value={index}>{province_name}</option>))}
                            </Input>
                        </Col>
                        <Col sm={3}>
                            <Input type="select" onChange={(e) => {
                                setaddress({ ...address, district: e.target.value });
                                if (e.target.value === "-1") { 
                                    setaddress({ ...address, district: "", ward: "" });
                                    getWards(0);
                                } else {
                                    setaddress({ ...address, district: districts[e.target.value].district_name, ward: "" });
                                    getWards(districts[e.target.value].district_id);
                                }
                            }}>
                                <option value={-1}>Please choose District</option>
                                {districts.length && districts.map(({district_id, district_name}, index) => (<option key={district_id} value={index}>{district_name}</option>))}
                                
                            </Input>
                        </Col>
                        <Col sm={3}>
                            <Input type="select" onChange={(e) => {
                                setaddress({ ...address, ward: e.target.value });
                                if (e.target.value === "-1") { 
                                    setaddress({ ...address, ward: "" });
                                } else {
                                    setaddress({ ...address, ward: wards[e.target.value].ward_name });
                                }
                            }}>
                                <option value={-1}>Please choose Ward</option>
                                {wards.length && wards.map(({ward_id, ward_name}, index) => (<option key={ward_id} value={index}>{ward_name}</option>))}
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
                                value={language}
                                onChange={(value) => {
                                    setlanguage(value)
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
                                    settechSkill(value)
                                }} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="examplePassword" sm={2}>
                            How much can you spend on courses?
                        </Label>
                        <Col sm={10}>
                            <Input type="select" value={DTO.feeMax} onChange={(e) => setDTO({ ...DTO, feeMax: e.target.value })}>
                                <option value={""}></option>
                                <option value={"less than 5 millions"}>Less than 5 millions</option>
                                <option value={"5 milions to 15 millions"}>5 milions to 15 millions</option>
                                <option value={"15 milions to 30 millions"}>15 milions to 30 millions</option>
                                <option value={"more than 30 milions"}>More than 30 milions</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelectMulti" sm={2}>
                            What time is suitable for you, if we have offline courses?
                        </Label>
                        <Col sm={10}>
                            <Select isMulti components={makeAnimated()}
                                closeMenuOnSelect={false}
                                getOptionLabel={option => option}
                                getOptionValue={option => option}
                                options={lsFreeTime} className="basic-multi-select" classNamePrefix="select"
                                value={freeTime}
                                onChange={(value) => {
                                    setfreeTime(value)
                                }}
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        </Fragment>
    )
}
