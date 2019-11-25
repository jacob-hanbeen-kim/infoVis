import sys,os,csv
import pandas as pd
def explore_inputFile(inFile):
    df = pd.read_csv(inFile)
    #find unique values of type of exploitation
    # print(df.columns) 
    """ #Index(['Year of Registration', 'Datasource', 'Gender', 'Age Broad',
       'Majority Status', 'Majority At Exploit', 'Majority Entry',
       'Citizenship', 'Means of Control', 'Reason for Trafficking',
       'Type Of Exploitation', 'Type of Labour', 'Type of Sex', 'is Abduction',
       'Recruiter Relationship', 'Country of Exploitation'], """

    exploitation_types = df["Type Of Exploitation"].unique()

    """ ['Unknown' 'Sexual exploitation' 'Forced labour' 'Other'
    'Forced labour;Sexual exploitation;Combined sexual and labour exploitation'
    'Slavery and similar practices' 'Forced marriage'
    'Forced labour;Slavery and similar practices'] """
    freq = df["Type Of Exploitation"].value_counts()
    # print(freq)
    #group by year and find exploit types of each year
    new_df=df.groupby(["Year of Registration","Type Of Exploitation"])
    # print(new_df.first())

    """ 
    Sexual exploitation                                                          18979
    Unknown                                                                      18893
    Forced labour                                                                 9815
    Other                                                                         7066
    Slavery and similar practices                                                  374
    Forced marriage                                                                154
    Forced labour;Sexual exploitation;Combined sexual and labour exploitation      152
    Forced labour;Slavery and similar practices                                      1 """
    sex_types = df["Type of Sex"].value_counts()
    # print(sex_types)
    """ 
    Unknown                    49665
    Prostitution                5552
    Pornography                  183
    Private sexual services       34 """
    labour_types =df["Type of Labour"].value_counts()
    # print(labour_types)
    """ Unknown                        48042
    Domestic work                   2214
    Not specified                   1669
    Construction                    1220
    Agriculture                      483
    Domestic Work                    474
    Manufacturing                    440
    Other                            301
    Begging                          174
    Hospitality                      128
    Other;Not specified               95
    Aquafarming                       93
    Peddling                          60
    Domestic work;Other               22
    Sexual exploitation               13
    Agriculture;Not specified          3
    Construction;Not specified         2
    Domestic Work;Not specified        1 """

def get_typesByYear(inFile,outFile):
    cols = ['Type Of Exploitation', 'Type of Labour', 'Type of Sex']
    df=pd.read_csv(inFile)
    year_df=df.groupby("Year of Registration")
    year_df=year_df['Type Of Exploitation'].value_counts()
    
    year_df.to_csv(outFile)
    

# def convert_JSexploit_types(inFile,outFile):
#     # df=pd.read_csv(inFile)
#     # for idx,item in df.iterrows():
#     #     print(item)
#     a_dict= {}
#     with open (outFile,'w',newline='') as csvfile:
#         csv_writer = csv.writer(csvfile,delimiter=",")
#         with open(inFile,'r') as fh:
#             for l in fh.readlines():
#                 cols=l.split(",")
#                 year,exploit_type , count = cols[0],cols[1],cols[2].strip()
#                 csv_writer.writerow([year,exploit_type , count])
def summary2(inFile):
    years=['2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017',"2018"]
    exploit_count={y:{} for y in years }
    sex_count={y:{} for y in years }
    labour_count={y:{} for y in years }
    with open(inFile,'r') as fh:
        next(fh)
        for l in fh.readlines():
            cols = l.split(",") #0 is year, 1 is exploitation, 2 is type of Labour, 3 is type of sex
            # print(cols)
            year, exploit_type,labour_type,sex_type=cols[0],cols[1],cols[2],cols[3].strip()
            if exploit_type not in exploit_count[year]:
                exploit_count[year][exploit_type]=1
            else:
                exploit_count[year][exploit_type]+=1

            if labour_type not in labour_count[year]:
                labour_count[year][labour_type] =1
            else:
                labour_count[year][labour_type]+=1

            if sex_type not in sex_count[year]:
                sex_count[year][sex_type] =1
            else:
                sex_count[year][sex_type]+=1
    summary={y:{} for y in years }
    
    # for year in years:
    #     types = sex_count[year].keys()
    #     sex_cols.extend(list(types))
    # sex_cols= set(sex_cols)
    labour_cols=[]
    for year in years:
        types = labour_count[year].keys()
        labour_cols.extend(list(types))
    labour_cols= set(labour_cols)
    print(labour_cols)
    # with open("summary.csv",'w') as fh:
    #     for year in exploit_count.keys():
    #         exploit_types=exploit_count[year].keys()
            # print(exploit_types)

def refineInFile(inFile,outFile):
    df=pd.read_csv(inFile)
    # print(df["Type of Labour"].value_counts())
    final_df=df.apply(lambda x: x.replace("Not specified","Unknown"))
    final_df=final_df.apply(lambda x: x.replace("Domestic work;Other","Domestic Work"))
    final_df=final_df.apply(lambda x: x.replace("Domestic work","Domestic Work")).apply(lambda x: x.replace("Other","Unknown"))\
        .apply(lambda x: x.replace("Other;Not specified","Unknown"))\
        .apply(lambda x: x.replace("Domestic Work;Not specified","Unknown"))\
        .apply(lambda x: x.replace("Agriculture;Not specified","Agriculture"))\
        .apply(lambda x: x.replace("Construction;Not specified","Construction"))
        # .apply(lambda x: x.replace("Construction;Not specified","Construction"))
    
    final_df.to_csv(outFile,index=False)
def summary(inFile):
    df=pd.read_csv(inFile)
    types= df["Type Of Exploitation"].value_counts()
    print(types)
def main():
    inFile = sys.argv[1]
    # explore_inputFile(inFile)
    refineFile="cleanData_refine.csv"
    if not os.path.isfile(refineFile):
        refineInFile(inFile,refineFile)
    
    # summary(refineFile)
    
    
if __name__ == "__main__":
    main()