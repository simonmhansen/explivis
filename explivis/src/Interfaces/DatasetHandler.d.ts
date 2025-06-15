export interface DatasetHandler {

    /**
     * This function loads in locally-defined datasets
     */
    loadDatasets(): Promise<any>

    /**
     * This function handles user-uploaded datasets and adds it to the Python environment through the Python Handler.
     * @param file the uploaded dataset file
     */
    uploadDataset(file: File): void
}