import csv

def merge_by_relation(file_path):
    with open('results5.csv', 'r') as f:
        reader = csv.reader(f, delimiter=',')
        p = {}
        for i, line in enumerate(reader):
            if i == 0:  # skips column index names
                continue
            population = line[2].split(';')[0] if ';' in line[2] else line[2]
            key = '{},{},{}'.format(line[0], line[1], population)
            if key not in p:
                p[key] = int(line[3])
            else:
                p[key] += int(line[3])
    return p

def write_csv_file(values):
    with open('merging.csv', 'w+', newline='') as f:
        writer = csv.writer(f)
        for key, value in values.items():
            csv_line = '{},{}'.format(key, value)
            writer.writerow(csv_line.split(','))

write_csv_file(merge_by_relation('input.csv'))