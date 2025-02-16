from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Flask app! Try visiting /api/data to get JSON data."

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Hello from Python!',
        'numbers': [1, 2, 3, 4, 5]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
