"""
Created on Thu Oct  3 09:12:53 2019

Graphtreon Web Scraping

"""
from bs4 import BeautifulSoup
import csv

# Ran into issues pulling page directly with the creator tables attached.
# Saved file and used save instead

# Establish html list
htmlList = ['GraphtreonArtists001-100.html',
            'GraphtreonArtists101-200.html',
            'GraphtreonArtists201-300.html',
            'GraphtreonArtists301-400.html',
            'GraphtreonArtists401-500.html',
            'GraphtreonArtists501-600.html',
            'GraphtreonArtists601-700.html',
            'GraphtreonArtists701-800.html',
            'GraphtreonArtists801-900.html',
            'GraphtreonArtists901-1000.html',
            'GraphtreonArtists1001-1100.html',
            'GraphtreonArtists1101-1200.html',
            'GraphtreonArtists1201-1300.html',
            'GraphtreonArtists1301-1400.html',
            'GraphtreonArtists1401-1500.html',
            'GraphtreonArtists1501-1600.html',
            'GraphtreonArtists1601-1623.html']

# Establish csv list
csvFile = 'FullGraphtreonDataset.csv'

# Create/open and settup csv file with headers
csv_file = open(csvFile, 'w')
csv_writter = csv.writer(csv_file)
csv_writter.writerow(['Rank', 'CreatorName', 'Description', 'CreatorSite', 'Patrons', 'Earnings','EarningPerPatron', 'DaysRunning', 'Launched'])

for i in range(0,len(htmlList)): #len(htmlList)):
    # Open HTML page saved directly
    with open(htmlList[i]) as source:
        GraphtreonArtists = BeautifulSoup(source, 'lxml') 
        
    # tbody is the table body where all the current data is stored
    tbody = GraphtreonArtists.find("tbody")
    # Create an empty row (to be written into the csv)
    row = []
    
    # Main loop where tr is scooped table row (tr) by table column (td)
    for tr in tbody.find_all("tr"): # Cycle rows

        for td in tr.find_all("td"): # Cycle columns
            row.append(td.text) # Appends eacg column into the rows
        row.insert(1, tr.find(class_="creatorName").text) #Specifically pulls creator name
        row.insert(3, tr.find("a")['href']) #Specifically pulls www.graphtreon/creator link to
        csv_writter.writerow(row) # Write row to csv
        row = [] # Wipe row clean for next line

    
csv_file.close() # Very important step. Always close files when you're done