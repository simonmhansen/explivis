import json
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import f1_score, silhouette_score, davies_bouldin_score

def evaluate_clustering(json_data):
    data = json.loads(json_data)
    df = pd.DataFrame(data["values"])
    clusters = df["cluster"].astype(int).values
    X, y = fetch_dataset()
    
    # Compute clustering metrics
    f1 = f1_score(y, clusters, average='weighted')
    silhouette = silhouette_score(X, clusters)
    davies_bouldin = davies_bouldin_score(X, clusters)
    
    # Format as Vega-Lite JSON
    metrics = [
        {"metric": "F1 Score", "value": f1},
        {"metric": "Silhouette Score", "value": silhouette},
        {"metric": "Davies-Bouldin Score", "value": davies_bouldin}
    ]
    return json.dumps({"values": metrics})

def main(parent):
    scores = evaluate_clustering(parent)

    return scores