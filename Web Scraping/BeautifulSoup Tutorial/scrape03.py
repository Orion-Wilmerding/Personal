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

source = requests.get('https://coreyms.com/').text #text gets the HTML

soup = BeautifulSoup(source, 'lxml')

article = soup.find('article')

vid_src = article.find('iframe', class_='youtube-player') 
#grabs the specific iframe within the article
#print(vid_src)

vid_src = article.find('iframe', class_='youtube-player')['src']
#treats article's iframe like a dictionary and pulls the name of the item 'src'
#print(vid_src)

vid_id = vid_src.split('/')[4] #split turns the string into a list based on value '/'
vid_id = vid_id.split('?')[0]
#print(vid_id)

yt_link = f'https://youtube.com/watch?v={vid_id}' #use f string to concatonate {vid_id}
#print(yt_link)

# Can now loop for all:

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
        
    print()

    print(yt_link)
    print()
    





