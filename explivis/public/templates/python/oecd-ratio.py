import pandas as pd
def main(parent):
    orig_df = parent[0]
    total_sum = orig_df[orig_df['World Intellectual Property Organization domains'] == 'Total'].rename(
        columns={
        'OBS_VALUE': 'Total'
        })
    total_sum = total_sum[['Reference area', 'TIME_PERIOD', 'Total']]

    merged_df = orig_df.merge(total_sum, on = ['Reference area', 'TIME_PERIOD'])
    ratio_df = merged_df[merged_df['World Intellectual Property Organization domains'] != 'Total'].copy()
    ratio_df.loc[:, 'ratio'] = ratio_df['OBS_VALUE'] / ratio_df['Total']


    return ratio_df