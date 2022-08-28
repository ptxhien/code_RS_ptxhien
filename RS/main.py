from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import buildRule, dao, function, knowledgeDomain
import pandas as pd
import json, io
# -*- coding: utf-8 -*-

# start flask server backend
app = Flask(__name__)

# apply Flask Cors  
CORS(app) 
app.config['CORS_HEADERS'] = 'Content-Type'


# ------------- RS -------------# 
@app.route("/recommendation", methods=["POST", "GET"])
@cross_origin(origin='*')
def RS():
    # 1. lay thong tin learner chon tren fontend 
    occupation = request.args.get("occupation").strip()
    form = request.args.get("form")
    month = request.args.get("month")
    email = request.args.get("email")
    typeFilter = request.args.get("typeFilter")

    # 2. load information relate learner
    # user profile
    df_attribute_requirement = dao.User_Preq_Attributes(email, occupation, form, month,typeFilter)
    
    # load courses
    df_courses_On = function.take_CourseOnline(df_attribute_requirement)
    df_courses_Off = function.take_CourseOffline(df_attribute_requirement)
    
    # find missing skill
    missing_skill = function.FindMissingSkill(df_attribute_requirement)
    dict_f = {}
    
    # 3. Dua vao model
    if len(df_attribute_requirement) > 0:
        lan_know = df_attribute_requirement.language[0].split(', ')
        feeMax = df_attribute_requirement.feeMax[0]
        Learner_Job_Now = df_attribute_requirement.jobNow[0]
        Learner_FreeTime = df_attribute_requirement.freeTime[0]
        typeFilter = df_attribute_requirement.typeFilter[0]
        location = df_attribute_requirement.address[0]
        condition_duration = df_attribute_requirement.durationSecond[0]
        Form_require = df_attribute_requirement.Form_require[0]
        
        if len(missing_skill) > 0:
            if len(df_courses_On) > 0 or len(df_courses_Off) > 0:
                dict_f = buildRule.recommendation(df_courses_On, df_courses_Off, missing_skill, lan_know, location, occupation, Form_require, Learner_Job_Now, Learner_FreeTime, feeMax, condition_duration, typeFilter)
            else:
                lst_job_sim = knowledgeDomain.job_related(occupation)
                del lst_job_sim[0:1]
                dict_f = {"message": "Don't Course provide for Occupation",
                            "status": 406, 
                            "lst_Occupation": lst_job_sim}
        else:
            dict_f = {"message": "enough skills",
                    "status": 203}
    else:
        dict_f = {"message": "This user doesn't exist",
                    "status": 407}
        
    # save file result
    file_name = 'KQ_RS.json'
    with open(file_name, 'w') as f:
        json.dump(dict_f, f, ensure_ascii=False, indent=4) 
    
    # 4. tra ket qua ve trang chu hien thi
    # return render_template("index.html", dict_f)
    return dict_f
        
# start backend 
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port = '6868')
    
    