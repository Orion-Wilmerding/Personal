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

#print(article.prettify())

headline = article.h2.a.text
print(headline)

summary = article.find('div', class_='entry-content').p.text
print(summary)


















