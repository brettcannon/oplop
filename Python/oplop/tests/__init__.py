import json
import os.path

file_path = os.path.join(os.path.dirname(__file__), 'testdata.json')
with open(file_path, encoding="utf-8") as file:
    testdata = json.load(file)
