import React, { Fragment } from "react";
import { Dot } from "reactour";
import {
    Row,
    Col,
    TabContent,
    TabPane,
    ButtonGroup,
    ListGroup,
    ListGroupItem,
    Card,
    CardBody,
    CardFooter,
    Button,
    CardTitle
} from "reactstrap";


export default function WizardStep4({ DTO, onClickRegister }) {
    return (
        <Fragment>
            <div className="form-wizard-content">
                <div className="no-results">
                    <Card body className="card-shadow-primary border mb-3" outline color="primary">
                        <CardTitle>Confirm register!</CardTitle>
                        <p>Full Name: <b>{DTO.fullname}</b></p>
                        <p>Address: <b>{DTO.city + ', ' + DTO.district + ', ' + DTO.ward}</b></p>
                        <p>Email: <b>{DTO.email}</b></p>
                        <p>Job Now: <b>{DTO.jobNow}</b></p>
                        <p>Degree: <b>{DTO.learnerLevel}</b></p>
                        <p>Field Of Study: <b>{DTO.fieldOfStudy && DTO.fieldOfStudy.map(({techName}) => techName).join(', ')}</b></p>                        <p>Degree: <b>{DTO.learnerLevel}</b></p>
                        <p>Languages: <b>{DTO.language.map(({lanName}) => lanName).join(', ')}</b></p>
                        <p>Skills: <b>{DTO.technologySkill.map(({techName}) => techName).join(', ')}</b></p>
                        <p>Fee max: <b>{DTO.feeMaxText}</b></p>
                        <p>Free time: <b>{DTO.freeTime && DTO.freeTime.join(', ')}</b></p>
                        <p>Future Self Development: <b>{DTO.futureSelfDevelopment}</b></p>
                    </Card>
                    <div className="sa-icon sa-success animate">
                        <span className="sa-line sa-tip animateSuccessTip" />
                        <span className="sa-line sa-long animateSuccessLong" />
                        <div className="sa-placeholder" />
                        <div className="sa-fix" />
                    </div>
                    <div className="results-subtitle mt-4">Finished!</div>
                    <div className="mt-3 mb-3" />
                    <div className="text-center">
                        <Button color="success" size="lg" className="btn-shadow btn-wide" onClick={() => onClickRegister()}>
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}
