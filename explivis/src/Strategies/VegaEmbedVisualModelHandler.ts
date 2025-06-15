import { NODE_ID_STRING } from "../constants";
import type { VisualModelHandler } from "../Interfaces/VisualModelHandler";
import { pythonHandler } from "../stores";

export class VegaEmbedVisualModelHandler implements VisualModelHandler {

    /**
     * Embeds the visualisation produced from the code in the node. There are two edge cases:
     * 1) No code is supplied => No visualisation is rendered
     * 2) No data is supplied => Fetches data from Python 
     * @param nodeid The node to embed the visualisation in
     * @param code The Vega-Lite code to create the visualisation
     * @returns Whether the embedding succeeded
     */
    async embedVisualisation(nodeid: string, code: string): Promise<boolean> {
        // Pyodide risks creating memory leaks, which we handle below, for documentation see:
        // https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-using-py-obj-from-js
        // https://pyodide.org/en/stable/usage/api/js-api.html#pyodide.ffi.PyProxy
        // https://pyodide.org/en/stable/usage/api/js-api.html#pyodide.ffi.PyProxy.toJs
        // https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-pyproxy-to-js                


        let success = true

        // Bail out fast if no visualisation code is added.
        if (!code) {
            return success
        }

        // Get the dataHandler and convert it to JS with setup to let us remove memory leaks
        let dataHandler = pythonHandler.getDataHandler()
        let pyproxies : Array<any>= [];
        let dataHandlerJs = dataHandler.toJs({pyproxies});
        let spec = null
        try {
            spec = JSON.parse(code)    
        } catch (error) {
            console.error("Failed to parse visualisation code", error)
            return false
        }       

        // If the Visual model has not supplied its own data insert that of the Python model
        if (!("data" in spec)) {
            
            try {
                if (!(dataHandlerJs.has(nodeid))) {
                    console.error("Failed to create visualisation: No data supplied in either Visual or Python model.")
                    return false
                }

                let pythonData = dataHandlerJs.get(nodeid)
                spec["data"] = JSON.parse(pythonData)
                success = true

            } catch (error) {
                console.error("Failed to insert Python data into Visual Model. Does the Python data exist on the correct form?")
                success = false
            }
        }

        vegaEmbed(`#${NODE_ID_STRING}${nodeid}`, spec, {renderer: "svg"}).then(function(result) {
          // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
        }).catch(function(error) {
            console.error("Failed to embed Vega-Lite visualisation", error)
            success = false
        });


        // Clean up Python objects, so we don't have memory leaks
        for (let px of pyproxies) {
            px.destroy();
        }
        dataHandler.destroy();


        return success
    }
}