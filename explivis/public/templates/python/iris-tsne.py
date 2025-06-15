import json
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
def main(parent):
    X, _ = parent
    
    # Apply KMeans clustering
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)
    
    # Reduce dimensions with TSNE
    tsne = TSNE(n_components=2)
    X_reduced = tsne.fit_transform(X)
    
    # Create a DataFrame
    df = pd.DataFrame(X_reduced, columns=["x", "y"])
    df["cluster"] = clusters.astype(str)  # Convert clusters to string for Vega-Lite categorical coloring
    
    # Convert to Vega-Lite JSON format
    return json.dumps({"values": json.loads(df.to_json(orient="records"))})