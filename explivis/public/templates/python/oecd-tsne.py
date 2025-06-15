import json
from sklearn.manifold import TSNE
def main(parent):
    tsne_results_df = parent[1].reset_index()
    tsne = TSNE(n_components = 2, perplexity = 30)

    vis_data = tsne.fit_transform(parent[1])
    tsne_results_df['x'] = vis_data[:, 0]
    tsne_results_df['y'] = vis_data[:, 1]

    tsne_vega_data = json.dumps({"values": json.loads(tsne_results_df.to_json(orient="records"))})
    return tsne_vega_data