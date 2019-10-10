# -*- coding: utf-8 -*-
"""
Created on Sat Oct  5 12:19:58 2019

@author: Winchester

Takes the graphtreon aggregate data and visits each artists page
There it finds their patreon page, twitter and YouTube accounts
"""

from bs4 import BeautifulSoup
import requests
import csv

# Retrieve links from overview graphtreon csv file

allArtists_csv = 'GraphtreonDrawing&Painting.csv'

allArtistsLink = []
with open(allArtists_csv, 'r') as allArtists:   # opens csv as named 'r' read file
    reader = csv.reader(allArtists)             # creates a reader obj for read file
    next(reader)                                # Skips the header in the csv
    for line in reader:                         # 
        allArtistsLink.append(line[3])          # Pulls collumn 4 (link sites)

# Setup csv to write data too:
        
allArtistsAccounts = []
socialMedia_csv = open('socialMedia.csv', 'w')
writer = csv.writer(socialMedia_csv)
writer.writerow(['Rank', 'Instagram', 'Twitter', 'Youtube'])

for artist in range(0,len(allArtistsLink)):
    
    # Retrieve HTML data from patreon sites 
            
    source = requests.get(allArtistsLink[artist]).text   #text gets the HTML
    
    html = BeautifulSoup(source, 'lxml')
    
    #Set up link list
    
    # accounts = ["Patreon", "Twitter", "YouTube"]
    accounts = [0, 0 ,0]
    
    # Find Patreon link
    
    try:
        creatorpage = html.find(class_="creatorpageImage")
        accounts[0] = creatorpage.a['href']

    except:
        print("No creator page found")
    
    # Find social media links
    # For whatever reason, instagram isn't included on graphtreon
    
    try:
        headerstats = html.find_all(class_="headerstats-block")
        headerstatsHREF = []
        for header in headerstats:
            try:
                headerstatsHREF.append(header.a['href'])
            except:
                None
    except:
        print("No headerstats found in", allArtistsLink[0])
        
    # Parse hrefs to find which social media is which
    
    for href in range(0,len(headerstatsHREF)):
        hrefList = headerstatsHREF[href].split('/')[2]
    
        if hrefList == "twitter.com":
            accounts[1] = headerstatsHREF[href]
        elif hrefList == "www.youtube.com":
            accounts[2] = headerstatsHREF[href]
        else:
            print("Unrecognized social media")
            
    allArtistsAccounts.append(accounts)
    accounts.insert(0,artist+1)
    writer.writerow(accounts)
    print("Progress: ", artist, "/", len(allArtistsLink))

socialMedia_csv.close()

#print(html.prettify)