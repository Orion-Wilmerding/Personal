# -*- coding: utf-8 -*-
"""
Created on Sat Oct  5 12:19:58 2019

@author: Winchester
"""

from bs4 import BeautifulSoup
import requests
import csv

# Retrieve links from overview graphtreon csv file

allArtists_csv = 'GraphtreonDrawing&PaintingOverview.csv'

allArtistsLink = []
with open(allArtists_csv, 'r') as allArtists:   # opens csv as named 'r' read file
    reader = csv.reader(allArtists)             # creates a reader obj for read file
    next(reader)                                # Skips the header in the csv
    for line in reader:                         # 
        allArtistsLink.append(line[4])          # Pulls collumn 4 (link sites)

# Setup csv to write data too:
        
allArtistsAccounts = []
socialMedia02_csv = open('socialMedia02.csv', 'w')
writer = csv.writer(socialMedia02_csv)
writer.writerow(['Rank', 'Instagram', 'Facebook'])

for artist in range(0,len(allArtistsLink)):
    
    # Retrieve HTML data from patreon sites 
            
    source = requests.get(allArtistsLink[artist]).text   #text gets the HTML
    
    html = BeautifulSoup(source, 'lxml')
    
    # Find social media accounts
    
    # Set up account list:
    # Instagram, Facebook
    accounts = [0, 0]
    
    hrefList = []
    
    try:
        #socMedCard = html.find(class_="sc-kEYyzF")
        for link in html.find_all(class_="s19ttirb-0"):
            hrefList.append(link.a["href"])
    except:
        None
    
    for href in range(0,len(hrefList)):
        try:
            currenthref = hrefList[href].split('/')[2]
            
            if currenthref == "www.instagram.com":
                accounts[0] = hrefList[href]
            elif currenthref == "www.facebook.com":
                accounts[1] = hrefList[href]
                
        except:
            None
    accounts.insert(0,artist+1)
    allArtistsAccounts.append(accounts)
    writer.writerow(accounts)
    print("Progress: ", artist, "/", len(allArtistsLink))

socialMedia02_csv.close()