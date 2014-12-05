import requests
import json
import time
import sys
import unicodedata
import nltk
from nltk.tag.stanford import NERTagger
import os
import string
java_path = "C:/Program Files/Java/jdk1.8.0_25/bin/java.exe"
os.environ['JAVAHOME'] = java_path
user_agent = {'User-agent': 'super cool UVA bot by /u/AD_Curry'}
def getTrends():
    st = NERTagger('./stanford-ner-2014-10-26/classifiers/english.all.3class.distsim.crf.ser.gz','./stanford-ner-2014-10-26/stanford-ner.jar'); 
    created = 0
    next_id = ""
    data_str = '{"data":['
    search_json = ""
    count = 0
    oldest = 10000000000
    boo = False
    checker = ""
    page = 1
    temp = " "
    otherTemp = " "

    r = requests.get("http://www.reddit.com/r/all/new.json?sort=new&limit=100", headers = user_agent)
    # Loop over the first 100 pages of results
    while(True):
        search_json = r.text
        data = json.loads(search_json)
        #Loop over all the posts on a page
        for post_index in range(0, len(data["data"]["children"]) - 1):
                title = (data["data"]["children"][post_index]["data"]["title"])
                title = unicodedata.normalize('NFKD', title).encode('ascii','ignore')
                title = title.replace('"',"'").replace('\n', '').replace('\t', '') 
                score = str(data["data"]["children"][post_index]["data"]["score"])
                created = data["data"]["children"][post_index]["data"]["created"]
                link = "http://www.reddit.com" + data["data"]["children"][post_index]["data"]["permalink"]
                if('\u200e' not in title and ':' not in title):
                        count += 1
                        oldest = created
                        temp += title.translate(None, string.punctuation)
                        temp += " "
                        #current = '{\n\t"title": "' + title + '",\n'
                        #current += '\t"score": "' + score + '",\n'
                        #current += '\t"permalink": "' +  link + '",\n'
                        #current += '\t"created": ' + str(created) + "\n}"
                        #try:
                        #        json.loads(current)
                        #        data_str += current + ",\n"
                        #except ValueError, e:
                        #        print "fail!"
        print "Processed page " + str(page)
        temp = temp.split()
        try:
            apple = st.tag(temp)
            for pair in apple:
                if(pair[1] != 'O'):
                    #print pair[0]
                    otherTemp += pair[0] + " "
        except ValueError, e:
            print "fail!"    
        temp =" "
        page +=1
        if(page == 50):
            data_str += '{\n\t"title": "' + otherTemp + '"\n}'
            break;
        if(data["data"]["after"]):
            next_id = data["data"]["after"]
            r = requests.get("http://www.reddit.com/r/all/new.json?sort=new&limit=100&after=" +next_id, headers = user_agent)
        time.sleep(1/25)
        
        if(boo == True):
            print "true"
            break;
    data_str = data_str[:-2]
    data_str += "}]}"
    file = open(("./data/temp.json"), "w")
    file.write(data_str.encode('utf-8'))
    file.close()
    return data_str.encode('utf-8')

    
if __name__ == "__main__":
        if(len(sys.argv) < 3):
                print "Must supply command line arguments!"
        getSubData(sys.argv[1], sys.argv[2])
