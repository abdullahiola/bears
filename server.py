"""
Bear Capital Flask Server
Serves posts/comments from data.json and videos from videos/ folder
"""

import json
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pyngrok import ngrok

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')
VIDEOS_DIR = os.path.join(os.path.dirname(__file__), 'videos')

# Ensure data file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({'posts': [], 'reels': []}, f)

# Ensure videos directory exists
os.makedirs(VIDEOS_DIR, exist_ok=True)


def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)


def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)


# =====================
# POST ENDPOINTS
# =====================

@app.route('/api/posts', methods=['GET'])
def get_posts():
    data = load_data()
    return jsonify(data.get('posts', []))


@app.route('/api/posts', methods=['POST'])
def create_post():
    data = load_data()
    post = request.json
    # Ensure comments array exists
    if 'comments' not in post:
        post['comments'] = []
    data['posts'].insert(0, post)
    save_data(data)
    return jsonify(post), 201


@app.route('/api/posts/<post_id>', methods=['PUT'])
def update_post(post_id):
    data = load_data()
    updates = request.json
    for i, post in enumerate(data['posts']):
        if post['id'] == post_id:
            data['posts'][i] = {**post, **updates}
            save_data(data)
            return jsonify(data['posts'][i])
    return jsonify({'error': 'Post not found'}), 404


@app.route('/api/posts/<post_id>/upvote', methods=['POST'])
def upvote_post(post_id):
    data = load_data()
    for i, post in enumerate(data['posts']):
        if post['id'] == post_id:
            data['posts'][i]['upvotes'] = post.get('upvotes', 0) + 1
            save_data(data)
            return jsonify(data['posts'][i])
    return jsonify({'error': 'Post not found'}), 404


@app.route('/api/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    data = load_data()
    comment = request.json
    for i, post in enumerate(data['posts']):
        if post['id'] == post_id:
            if 'comments' not in data['posts'][i]:
                data['posts'][i]['comments'] = []
            data['posts'][i]['comments'].append(comment)
            save_data(data)
            return jsonify(comment), 201
    return jsonify({'error': 'Post not found'}), 404


@app.route('/api/posts/<post_id>/comments', methods=['GET'])
def get_comments(post_id):
    data = load_data()
    for post in data['posts']:
        if post['id'] == post_id:
            return jsonify(post.get('comments', []))
    return jsonify({'error': 'Post not found'}), 404


# =====================
# VIDEO ENDPOINTS
# =====================

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """List all videos in the videos folder with metadata"""
    videos = []
    if os.path.exists(VIDEOS_DIR):
        for filename in os.listdir(VIDEOS_DIR):
            if filename.lower().endswith(('.mp4', '.webm', '.mov')):
                filepath = os.path.join(VIDEOS_DIR, filename)
                videos.append({
                    'id': filename.replace('.', '_'),
                    'filename': filename,
                    'title': os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ').title(),
                    'url': f'/videos/{filename}'
                })
    return jsonify(videos)


@app.route('/videos/<path:filename>')
def serve_video(filename):
    """Serve video files from the videos directory"""
    return send_from_directory(VIDEOS_DIR, filename)


# =====================
# MAIN
# =====================

if __name__ == '__main__':
    port = 5001
    
    # Start ngrok tunnel
    print("Starting ngrok tunnel...")
    try:
        public_url = ngrok.connect(port)
        print(f"\n{'='*50}")
        print(f"🐻 Bear Capital Server")
        print(f"{'='*50}")
        print(f"Local:  http://localhost:{port}")
        print(f"Public: {public_url}")
        print(f"{'='*50}")
        print(f"\nVideos folder: {VIDEOS_DIR}")
        print(f"Data file: {DATA_FILE}")
        print(f"\nDrop .mp4 files in the videos folder to add reels!")
        print(f"{'='*50}\n")
    except Exception as e:
        print(f"ngrok error (server still works locally): {e}")
        print(f"\nRunning on http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=True)
