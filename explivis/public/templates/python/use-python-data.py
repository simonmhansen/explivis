import json
def main(parent):
    data = {
        "values": [
            {"x": 2, "y": 2},
            {"x": 3, "y": 3}
        ]
    }

    return json.dumps(data)