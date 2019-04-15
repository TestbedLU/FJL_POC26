from flask import Flask, render_template, jsonify, Response, stream_with_context
import requests

app = Flask(__name__)


@app.route('/')
def index():
    return render_template(
        'index.html',
        title='FJL'
    )


@app.route('/topowebb/<path:p>', methods=['GET'])
def topowebb(p = ''):
    url = 'http://hades.slu.se/lm/topowebb/v1.1/wmts/1.0.0/topowebb/default/3857/{0}'.format(p)

    # print(p)
    # print(url)

    try:
        # r = requests.get(url, stream=True, headers={"Authorization":"Basic bHVudTAwMDM6bWU3dzJUMTU5TmRPcw=="})
        r = requests.get(url, stream=True)
    except Exception as e:
        return jsonify("proxy service error: " + str(e))

    # print(r)

    if r.status_code == 200:
        return Response(stream_with_context(r.iter_content()), content_type = r.headers['content-type'])

    print(r.status_code, r)
    return Response(None, 404)


if __name__ == '__main__':
    app.run(debug = False,host='0.0.0.0')
