import sqlalchemy
import pandas as pd
# -*- coding: utf-8 -*-

#-------------------- CONSTANTS ----------------
db_connection_str = 'mysql+pymysql://root:123456@localhost:3306/test'
try:
    with open("./secret.txt") as secretFile:
        SECRETS = secretFile.readlines()
        db_connection_str = SECRETS[0].rstrip("\n") or 'mysql+pymysql://root:123456@localhost:3306/test'
except:
    db_connection_str = 'mysql+pymysql://root:123456@localhost:3306/test'


#-------------------- READ DATA --------------------
def create_connection(): 
    engine = sqlalchemy.create_engine(db_connection_str)
    return engine

def select_l(conn):
    sql = 'SELECT * FROM learner'
    df = pd.read_sql(sql, conn)
    return df

def select_courseOnline(conn):
    sql = 'SELECT * FROM onlineCourse'
    df = pd.read_sql(sql, conn)
    return df

def select_courseOffline(conn):
    sql = 'SELECT * FROM offlineCourse'
    df = pd.read_sql(sql, conn)
    return df

def select_job(conn):
    sql = 'SELECT * FROM job'
    df = pd.read_sql(sql, conn)
    return df

def select_invoice(conn):
    sql = 'SELECT * FROM Invoice'
    df = pd.read_sql(sql, conn)
    return df

def select_rating(conn):
    sql = 'SELECT * FROM RatingLearner'
    df = pd.read_sql(sql, conn)
    return df

#-------------------- TAKE USER REQUIREMENTS + USER ATTRIBUTES LEARNER --------------------
def User_Preq_Attributes(email, occupation, form, month, typeFilter):
    conn = create_connection()
    df_Learner = select_l(conn)
    
    df_Learner = df_Learner.loc[df_Learner.email == email]
    df_Learner = df_Learner.reset_index(drop=True)

    Requirement_Learner = []
    if month != "":
        Requirement_Learner.append({'Occupation': str(occupation), 'Form_require': str(form), 'duration': int(month), 'typeFilter': str(typeFilter)})
    elif month == "":
        Requirement_Learner.append({'Occupation': str(occupation), 'Form_require': str(form), 'duration': '00', 'typeFilter': str(typeFilter)})

    df_requirement_Learner = pd.DataFrame(Requirement_Learner)

    df_requirement_Learner['learnerID'] = df_Learner[['learnerID']]
    
    df_attribute_requirement = pd.merge(df_Learner, df_requirement_Learner, how='left', on='learnerID')
    df_attribute_requirement = df_attribute_requirement.fillna('') 
    
    if month != '':
        second = df_attribute_requirement['duration'] * 259200
    else:
        second = 0
    df_attribute_requirement['durationSecond'] = second
    return df_attribute_requirement
