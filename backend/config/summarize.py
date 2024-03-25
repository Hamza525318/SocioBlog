from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
import sys

text = ""
filename = sys.argv[1]
filepath = "./summaryFiles/{}".format(filename)

with open(filepath,'r') as file:
    text = file.read()


# Initialize parser and tokenizer
parser = PlaintextParser.from_string(text, Tokenizer("english"))

# Initialize TextRank summarizer
summarizer = TextRankSummarizer()
#print(type(summarizer))
# Summarize the text
summary = summarizer(parser.document, 5)

# Print the summarized tfext
text_summary = ""
for sentence in summary:
    text_summary += str(sentence)

print(text_summary)
        