import json
from sklearn.decomposition import PCA
def main(parent):
    pca_results_df = parent[1].reset_index()
    pca = PCA(n_components = 2)

    vis_data = pca.fit_transform(parent[1])
    pca_results_df['x'] = vis_data[:, 0]
    pca_results_df['y'] = vis_data[:, 1]

    pca_vega_data = json.dumps({"values": json.loads(pca_results_df.to_json(orient="records"))})

    return pca_vega_data