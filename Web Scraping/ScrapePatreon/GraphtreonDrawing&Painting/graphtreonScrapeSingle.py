"""
Created on Thu Oct  3 09:12:53 2019

Graphtreon Web Scraping

"""


from bs4 import BeautifulSoup
import csv

# Ran into issues pulling page directly with the creator tables attached.
# Saved file and used save instead

with open('test.html') as source:
    soup = BeautifulSoup(source, 'lxml')

csv_file = open('graphtreon.csv', 'w')
csv_writter = csv.writer(csv_file)
csv_writter.writerow(['Rank', 'CreatorName', 'Description', 'CreatorSite', 'Patrons', 'Earnings','EarningPerPatron', 'DaysRunning', 'Launched'])

tbody = soup.find("tbody")
row = tbody.tr #Cycle through rows here
col = []
for tr in tbody.find_all("tr"):
    for td in tr.find_all("td"):
        col.append(td.text)
    col.insert(1, tr.find(class_="creatorName").text)
    col.insert(3, tr.find("a")['href'])
    csv_writter.writerow(col)
    col = []

rank = row.find(class_="number").text
creatorName = row.find(class_="creatorName")
site = row.find("a")['href']
#description = row.find(td)

print(rank)
print(creatorName)
print(site)
#print(description)


csv_file.close()




