import json
import pandas as pd

def main(parent):
    df = pd.DataFrame.from_dict(__datasets['oecd-patents.json'])
    df = df[df['TIME_PERIOD'] == 2020]
    pivot_df = df.pivot(
        index='Reference area',
        columns='World Intellectual Property Organization domains',
        values='OBS_VALUE'
    ).fillna(0)

    __dataHandler['pivot_df'] = pivot_df
    return [df, pivot_df]