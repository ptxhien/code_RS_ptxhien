import function
import pandas as pd
from difflib import SequenceMatcher
from datetime import timedelta
import numpy
import os 
import dao
from sklearn.metrics.pairwise import pairwise_distances
# -*- coding: utf-8 -*-

# 1. Language
def Xet_Language(df_Onl, df_Off, filter, lst_lan):
    flat_language = 0 
    df = []
    if filter.lower() == "online":
        course_know = function.findCourseOn_basedOn_Language(df_Onl, lst_lan)
        df_Onl = course_know.copy()
        if len(course_know) == 0:
            flat_language = -1 
        df = df_Onl
    else: # 0 offline
        course_know = function.findCourseOn_basedOn_Language(df_Off, lst_lan)
        df_Off = course_know.copy()
        if len(course_know) == 0: 
            flat_language = -1 
        df = df_Off 
    return df, flat_language

# 2.  Location
def Xet_Location(df, location_1):
    flat_location = 0
    
    rule_off_Ward = lambda address: address.lower().split(', ')[-1]
    df['Ward'] = df['location'].apply(rule_off_Ward)
    rule_off_District = lambda address: address.lower().split(', ')[-2]
    df['District'] = df['location'].apply(rule_off_District)
    rule_off_City = lambda address: address.lower().split(', ')[-3]
    df['City'] = df['location'].apply(rule_off_City)

    Learner_Ward = location_1.lower().split(', ')[-1]
    Learner_District = location_1.lower().split(', ')[1]
    Learner_City = location_1.lower().split(', ')[0]

    test_city = df[df['City'] == Learner_City]
    if len(test_city) > 0: 
        if Learner_District != "":
            test_dis = test_city[test_city['District'] == Learner_District]
            if len(test_dis) > 0: 
                df = test_dis 
                if Learner_Ward != "":
                    test_ward = test_dis[test_dis['Ward'] == Learner_Ward]
                    if len(test_ward) > 0: 
                        df = test_ward
                    else:
                        flat_location = 3 
                        df = test_dis[test_dis['Ward'] != Learner_Ward]
            else:
                flat_location = 2 
                df = test_city[test_city['District'] != Learner_District]
    else:
        flat_location = 1  
        df = test_city
        
    return df, flat_location

# 3. Xet StudyForm and FrameTime Offline
def Xet_FrameStudy_JobNow(df, Job_Now, lst_frametime):
    df_Off = df.copy()
    flat_course_freetime = 0 
    lst_t_learner = []
    
    for i in lst_frametime.split(', '):
        lst_t_learner.append(i)

    if Job_Now.startswith('Work') | Job_Now.startswith('Study'):
        df = df[df['studyForm'].astype(str).str.startswith('Part time')] 
        if len(df) > 0:
            df1 = pd.DataFrame()
            for i1 in lst_t_learner:
                df1_1 = function.FindCoursebasedStudyTime(df, i1)
                df1 = df1.append(df1_1)
            if len(df1) > 0:
                df = df1 
            else:
                flat_course_freetime = 1 
                df = df1
        else:
            flat_course_freetime = 2 
            df = df[df['studyForm'].astype(str).str.startswith('Part time')]
    else:
        df = df_Off 
    return df, flat_course_freetime

# 4. Fee 
def TinhSumFeeRS(df, feeMax):
    nguong_max = 0
    flat_sum_fee = 0
    sum_bonus = 0.0
    sum_fee_course = 0.0

    if feeMax != "":
        df['feeVND'] = pd.to_numeric(df['feeVND'], downcast = 'float')
        sum_fee_course = df['feeVND'].sum()
        
        nguong_max = function.convertfee(feeMax)
        if sum_fee_course >= 0 and sum_fee_course <= nguong_max:
            flat_sum_fee = 0 
        else:
            sum_bonus = sum_fee_course - nguong_max
            flat_sum_fee = -1
            
    return flat_sum_fee, feeMax, sum_fee_course, sum_bonus

def Course_Learner_Fee(df, feeMax):
    Course_RS = [] 
    nguong_max = 0
    
    if feeMax != "": 
        total_fee_learn = 0 
        nguong_max = function.convertfee(feeMax) 
        
        for id, row in df.iterrows():  
            if total_fee_learn + row['feeVND'] <= nguong_max:
                total_fee_learn += row['feeVND']
                Course_RS.append(row) 
                    
    df_Course_RS = pd.DataFrame(Course_RS)
    return df_Course_RS

# 5. Duration 
def TinhSumDurationRS(df1, condition_duration):  
    flat_sum_duration = 0
    duration_bothem = 0
    kq_hocthem = 0
    
    if condition_duration > 0: 
        sum_learn_duration = "{:0>8}".format(str(timedelta(seconds=numpy.float64(condition_duration))))
        sum_second_learn = pd.to_numeric(condition_duration, downcast='integer')
        
        sum_second_course = df1['durationSecond'].sum()
        sum_course_duration = "{:0>8}".format(str(timedelta(seconds=numpy.float64(sum_second_course))))
        
        if sum_second_course > sum_second_learn:
            flat_sum_duration = -1
            duration_bothem = sum_second_course - sum_second_learn
            kq_hocthem = "{:0>8}".format(str(timedelta(seconds=numpy.float64(duration_bothem))))      
    return flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem

def Course_Learner_Duration(df, condition_duration):  
    Course_RS = [] 
    if int(condition_duration) > 0: 
        total_duration_learn = 0 
        for id, row in df.iterrows():
            if total_duration_learn + row['durationSecond'] <= condition_duration:
                total_duration_learn = total_duration_learn + row['durationSecond']
                Course_RS.append(row)
    df_Course_RS = pd.DataFrame(Course_RS)
    return df_Course_RS

# 6. Job simmilar
def Jac_Simmilar():
    conn = dao.create_connection()
    df = dao.select_job(conn)
    lst_all_Tech = list()
    for id, row in df.iterrows():
        for tec in row.loc['technologySkill'].split(', '):
            if (tec != '' and tec not in lst_all_Tech):
                lst_all_Tech.append(tec)
    lst_all_Tech.sort()

    TEMP = pd.get_dummies(lst_all_Tech, dtype=int)
    df_Course_Filter = df[['jobID','technologySkill']]
    df_Course_Filter = df_Course_Filter.join(TEMP)
    df_Course_Filter = df_Course_Filter.astype(str)
    skill = df_Course_Filter.columns[3:].tolist()
        
    for id, row in df_Course_Filter.iterrows():
        for k in range(len(skill)):
            df_Course_Filter.at[id,skill[k]] = '0'

    for id, row in df_Course_Filter.iterrows():
        for tec in row.loc['technologySkill'].split(', '):
            if (tec != ''):
                for k in range(len(skill)):
                    if (tec.strip() != skill[k].strip()):
                        continue
                    else:
                        df_Course_Filter.at[id,skill[k]] = '1'

    df_Course_Filter = df_Course_Filter.drop(columns='technologySkill')
    df_CourseID = df_Course_Filter[['jobID']]
    df_Course_Filter = df_Course_Filter.drop(columns='jobID')
    df_Courses_Jaccard = df_Course_Filter.T
    
    jac_sim1 = 1 - pairwise_distances(df_Courses_Jaccard.T, metric = "hamming")
    jac_sim1 = pd.DataFrame(jac_sim1, index=df_Courses_Jaccard.columns, columns=df_Courses_Jaccard.columns)
    
    jac_sim1.to_excel('jaccard_loc.xlsx')
    jac_sim = pd.read_excel('jaccard_loc.xlsx')
    os.remove('jaccard_loc.xlsx')
    jac_sim = jac_sim.rename(columns={"Unnamed: 0": "jobID"})
    jac_sim['jobID'] = df_CourseID

    jac_sim.index = jac_sim['jobID']
    jac_sim.columns.name = 'jobID'
    jac_sim = jac_sim.drop(columns="jobID")
    jac_sim.columns.name = 'jobID'
    jac_sim = jac_sim.T

    jac_sim['jobID'] = df_CourseID
    jac_sim.index = jac_sim['jobID']
    jac_sim.columns.name = 'jobID'
    jac_sim = jac_sim.drop(columns="jobID")
    return jac_sim

def get_top5_similar(JobID): 
    jac_sim = Jac_Simmilar()
    similar_score = jac_sim[JobID]
    similar_score = similar_score.sort_values(ascending=False)
    similar_score = similar_score.head(6)
    return similar_score

def job_related(jobTitle):
    conn = dao.create_connection()
    df = dao.select_job(conn)  
    df_job_id = df[df.jobTitle==jobTitle.strip()].jobID.iloc[0]
    df_get = get_top5_similar(df_job_id) 
    new_data = pd.merge(df_get, df, how='left', on="jobID")
    lst_job_sim = []
    for id, row in new_data.iterrows():
        if row["jobTitle"] not in lst_job_sim:
            lst_job_sim.append(row["jobTitle"])
    return lst_job_sim
