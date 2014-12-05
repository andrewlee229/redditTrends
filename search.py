import requests
import json
import time
import sys
import unicodedata

user_agent = {'User-agent': 'super cool UVA bot by /u/AD_Curry'}
def getSubData(subreddit, keyword, startDate, endDate):
    created = 0
    next_id = ""
    data_str = '{"data":['
    search_json = ""
    count = 0
    oldest = 10000000000
    boo = False
    checker = ""
    page = 1
    r = requests.get("http://www.reddit.com/r/" + subreddit +"/search.json?q=title:'" + keyword + "'+timestamp%3A" + startDate + ".." +  endDate +"&sort=new&restrict_sr=on&limit=100&syntax=cloudsearch", headers = user_agent)
    print "http://www.reddit.com/r/" + subreddit +"/search.json?q=title:'" + keyword + "'+timestamp%3A" + startDate + ".." +  endDate +"&sort=new&restrict_sr=on&limit=100&syntax=cloudsearch"
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
                if(float(created) < float(startDate)):
                    boo = True
                    break;
                if(created < oldest and '\u200e' not in title and ':' not in title and float(created) < float(endDate)):
                        count += 1
                        oldest = created
                        current = '{\n\t"title": "' + title + '",\n'
                        current += '\t"score": "' + score + '",\n'
                        current += '\t"permalink": "' +  link + '",\n'
                        current += '\t"created": ' + str(created) + "\n}"
                        try:
                                json.loads(current)
                                data_str += current + ",\n"
                        except ValueError, e:
                                print "fail!"
        print "Processed page " + str(page)
        page +=1
        if(data["data"]["after"]):
            next_id = data["data"]["after"]
            r = requests.get("http://www.reddit.com/r/" + subreddit +"/search.json?q=title:'" + keyword + "'+timestamp%3A" + startDate + ".." +  endDate +"&sort=new&restrict_sr=on&limit=100&syntax=cloudsearch&after=" +next_id, headers = user_agent)
        else:
            endDate = str(int(created))
            if(checker == endDate):
                break
            checker = endDate
            r = requests.get("http://www.reddit.com/r/" + subreddit +"/search.json?q=title:'" + keyword + "'+timestamp%3A" + startDate + ".." +  endDate +"&sort=new&restrict_sr=on&limit=100&syntax=cloudsearch", headers = user_agent)
        time.sleep(1/25)
        
        if(boo == True):
            print "true"
            break;
    data_str = data_str[:-2]
    data_str += "]}"
    file = open(("./data/" + subreddit.encode('utf-8') + "-" + keyword.encode('utf-8') + ".json"), "w")
    file.write(data_str.encode('utf-8'))
    file.close()
    return data_str.encode('utf-8')

    
if __name__ == "__main__":
        if(len(sys.argv) < 3):
                print "Must supply command line arguments!"
        getSubData(sys.argv[1], sys.argv[2])
