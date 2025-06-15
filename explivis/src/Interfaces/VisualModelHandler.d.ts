export interface VisualModelHandler {
    /**
     * Embeds the code for a visualisation in the given node
     * @param nodeid Node to embed visualisation in
     * @param code The code used for embedding
     */
    async embedVisualisation(nodeid: string, code: string) : Promise<boolean>;
}