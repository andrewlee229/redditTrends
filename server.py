from bottle import post, request, route, run, static_file
import processing.search

@post('/process')
def process():
    subreddit = request.forms.get('subreddit')
    topic = request.forms.get('topic')
    startDate = request.forms.get('startDate')
    endDate = request.forms.get('endDate')
    print("Requested: ", subreddit, topic)
    return processing.search.getSubData(subreddit, topic, startDate, endDate)

@route('/')
def root():
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

run(host='localhost', port=8080, debug=True)
