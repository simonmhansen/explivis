import json
import pandas as pd
from sklearn.cluster import KMeans
def main(parent):
    pivot_df = __dataHandler['pivot_df']
    parent_data = json.loads(parent)
    parent_df = pd.DataFrame(parent_data["values"])

    kmeans = KMeans(n_clusters = 4)
    parent_df['cluster'] = kmeans.fit_predict(pivot_df)

    pca_cluster_data = json.dumps({"values": json.loads(parent_df.to_json(orient="records"))})

    return pca_cluster_data