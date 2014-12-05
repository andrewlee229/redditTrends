# 'pip install bottle' before running this!
from bottle import route, run, get, post, request, static_file, response
import search, json, os, trends

@post('/process')
def process():
    subreddit = request.forms.get('subreddit')
    topic = request.forms.get('topic')
    startDate = request.forms.get('startDate')
    endDate = request.forms.get('endDate')
    print "Requested: ", subreddit, topic
    # return static_file("programming-ruby.json", root="./data/")
    response.content_type = 'application/json'
    if(os.path.exists('data/' + subreddit + '-' + topic + '.json')):
        return static_file(subreddit + '-' + topic + '.json', root='./data')
    return search.getSubData(subreddit, topic, startDate, endDate)

@post('/trending')
def process():
    print "Analysis in progress..."
    #return static_file('temp.json', root='./data')
    return trends.getTrends()

@post('/music')
def process():
    if int(request.forms.get('num')) == 0:
        return static_file('music-one direction.json', root='./presets')
    if int(request.forms.get('num')) == 1:
        return static_file('music-wu tang clan.json', root='./presets')
    if int(request.forms.get('num')) == 2:
        return static_file('music-taylor swift.json', root='./presets')

@post('/programming')
def process():
    if int(request.forms.get('num')) == 0:
        return static_file('programming-c++.json', root='./presets')
    if int(request.forms.get('num')) == 1:
        return static_file('programming-java.json', root='./presets')
    if int(request.forms.get('num')) == 2:
        return static_file('programming-ruby.json', root='./presets')

@post('/movies')
def process():
    if int(request.forms.get('num')) == 0:
        return static_file('movies-hobbit.json', root='./presets')
    if int(request.forms.get('num')) == 1:
        return static_file('movies-hunger games.json', root='./presets')
    if int(request.forms.get('num')) == 2:
        return static_file('movies-star wars.json', root='./presets')

@route('/')
def root():
    print "root!" 
    return static_file('index.html', root='./resources')

@route('/resources/<filename>')
def server_static(filename):
        return static_file(filename, root='./resources')

@route('/css/<filename>')
def server_static(filename):
        return static_file(filename, root='./css')

@route('/js/<filename>')
def server_static(filename):
        return static_file(filename, root='./js')

@route('/data/<filename>')
def server_static(filename):
        return static_file(filename, root='./data')

run(host='localhost', port=8080, debug=True)
