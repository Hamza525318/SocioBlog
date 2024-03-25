#open source python library for natural language processing
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk .probability import  FreqDist
import sys

filename = sys.argv[1]
file_path = "./blogfiles/{}.txt".format(filename)
essay = ""

with open(file_path,'r') as file:
    essay = file.read()
    
words = word_tokenize(essay)

# Filter out common grammar words
stop_words = set(stopwords.words('english'))
filtered_words = [word.lower() for word in words if word.isalnum() and word.lower() not in stop_words]

# calculate frequency distribution
freq_dist = FreqDist(filtered_words)

# Get the 5 most common keywords
top_keywords = freq_dist.most_common(5)
top_words = []

for word in top_keywords:
    top_words.append(word[0])

print(top_words)


