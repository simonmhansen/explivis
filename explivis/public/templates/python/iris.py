import json
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def fetch_dataset():
    """Load the Iris dataset."""
    data = load_iris()
    return data.data, data.target

def main(parent):
    return fetch_dataset()