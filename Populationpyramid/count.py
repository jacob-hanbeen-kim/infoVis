import csv

# Create dictionary to hold the data
valDic = {}

years, genders, age, country = set(), set(), set(), set()

# Read data into dictionary
with open('newData.csv', 'r',) as inputfile:

    reader = csv.reader(inputfile, delimiter = ',')
    next(reader)

    for row in reader:

        key = (row[0], row[2], row[3], row[7])

        years.add(key[0])
        genders.add(key[1])
        age.add(key[2])
        country.add(key[3])

        if key not in valDic:
            valDic[key]=0

        valDic[key]+=1


#Add missing combinations
for y in years:
    for g in genders:
        for a in age:
            for c in country:
                key = (y, g, a, c)
                if key not in valDic:
                    valDic[key]=0

#Prepare new CSV
newcsvfile = [["year", "gender", "age", "country", "population"]] 

for key, val in sorted(valDic.items()):
    newcsvfile.append([key[0], key[1], key[2], key[3], valDic[key]])

with open('results.csv', "w", newline='') as outputfile:
    writer = csv.writer(outputfile)
    writer.writerows(newcsvfile)  
		