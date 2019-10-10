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

with open('simple.html') as html_file:
    soup = BeautifulSoup(html_file, 'lxml')
    
#print(soup.prettify()) #Prettify makes the html indent/be more readible

match = soup.title #Pulls the FIRST tilte tag

#print(match)

match2 = soup.find('div') # Finds first div

#print(match2)

match3 = soup.find('div', class_='footer')

#print(match3) 

article = soup.find('div', class_='article')
#print(article)

headline = article.h2.a.text
#print(headline)

summary = article.p.text
#print(summary)

for article in soup.find_all('div', class_='article'): #Finds all 
    headline = article.h2.a.text
    print(headline)
    
    summary = article.p.text
    print(summary)
    print()





















