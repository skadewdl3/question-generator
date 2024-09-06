from flask import Flask, request, jsonify
import pymupdf
import chromadb
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"])

# Check if file has a valid extension
ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):
        # Read the file directly into memory
        pdf_bytes = file.read()

        # Use PyMuPDF (fitz) to open the PDF from memory
        pdf_doc = pymupdf.open(stream=pdf_bytes, filetype='pdf')

        # Extract text from each page of the PDF
        extracted_text = []
        for page in pdf_doc:
            extracted_text.append(page.get_text("blocks"))
        extracted_text = list(
            map(lambda x: [block[4] for block in x], extracted_text))

        return jsonify({'text': extracted_text})

    return jsonify({'error': 'Invalid file type'}), 400


@app.route('/', methods=['GET'])
def index():
    return '''
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload PDF</title>
    </head>
    <body>
        <h1>Upload PDF File</h1>
        <form method="POST" action="/upload" enctype="multipart/form-data">
            <input type="file" name="file">
            <input type="submit" value="Upload">
        </form>
    </body>
    </html>
    '''


if __name__ == '__main__':
    app.run(debug=True)
