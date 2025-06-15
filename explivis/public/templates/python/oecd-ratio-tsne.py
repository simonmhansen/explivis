import json
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans
def main(parent):
    pivot_df = parent.pivot(
        index='Reference area',
        columns='World Intellectual Property Organization domains',
        values='ratio'
    ).fillna(0)

    kmeans = KMeans(n_clusters = 4)

    tsne_results_df = pivot_df.reset_index()
    tsne = TSNE(n_components = 2, perplexity = 30)

    vis_data = tsne.fit_transform(pivot_df)
    tsne_results_df['x'] = vis_data[:, 0]
    tsne_results_df['y'] = vis_data[:, 1]
    tsne_results_df['cluster'] = kmeans.fit_predict(pivot_df)

    tsne_vega_data = json.dumps({"values": json.loads(tsne_results_df.to_json(orient="records"))})
    return tsne_vega_data