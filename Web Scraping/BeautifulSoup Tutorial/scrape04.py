"""
Created on Sat Sep 28 16:11:22 2019

@author: Winchester

Python Webscraping

Check that beautifulsoup4 is installed
Check that lxml is installed
Check that requests is installed

HTML uses tags to open/close information. Use these to find things.
"""

from bs4 import BeautifulSoup
import requests
import csv

source = requests.get('https://coreyms.com/').text #text gets the HTML

soup = BeautifulSoup(source, 'lxml')

csv_file = open('cms_scrape.csv', 'w')

csv_writter = csv.writer(csv_file)
csv_writter.writerow(['headline', 'summary', 'videolink'])

for article in soup.find_all('article'):
    
    headline = article.h2.a.text
    print(headline)
    print()

    summary = article.find('div', class_='entry-content').p.text
    print(summary)
    print()
    
    #There will be times when some data is missing. E.g. NoneType
    #To fix, add a try/except block
    
    try:
            vid_src = article.find('iframe', class_='youtube-player')['src']
            vid_id = vid_src.split('/')[4]
            vid_id = vid_id.split('?')[0]
            yt_link = f'https://youtube.com/watch?v={vid_id}'
            
    except Exception as e:
        yt_link = None

    print(yt_link)
    print()
    
    csv_writter.writerow([headline, summary, yt_link])

csv_file.close()




