/**
 * This file holds a deprecated AltairVisualModelHandler
 * It remains to illustrate how Altair could be used instead of Vega-Embed
 */

import type { PythonHandler } from "../Interfaces/PythonHandler";
import type { VisualModelHandler } from "../Interfaces/VisualModelHandler";
import { NODE_ID_STRING } from "../constants";

export class AltairVisualModelHandler implements VisualModelHandler {
    pythonHandler : PythonHandler;

    constructor(pythonHandler : PythonHandler) {
        this.pythonHandler = pythonHandler;
    }


    /**
     * This function converts "false" to "False" and "true" to "True". This is because the Python FFI
     * is a bit too smart and converts this into a dict by itself, which it shouldn't. It should use JSON.loads
     * to handle the booleans.
     * @param code
     */
    convertBooleansToPython(code : string) : string {
        return code.replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False");
    }

    async embedVisualisation(nodeid: string, code: string): Promise<void> {
        let booleanSecureCode = this.convertBooleansToPython(code);

        let program : string = `
from pyscript import display
import json
import altair


## The code is actually JSON, which Python automatically converts into a dict from the JS-Python FFI
try:
    code = ${booleanSecureCode}
except Exception as e:
    print("Failed to convert Vega-Lite schema to JSON. Please check your Vega-Lite schema")

## Add checks to add Python Model if there is no data attached
if "data" in code:
    if isinstance(code["data"], dict) and not code["data"]:
        print("Found empty 'data' in the Vega-Lite schema. Adding data from the Python Model")
        try:
            code["data"] = __dataHandler["${nodeid}"]
        except Exception as e:
            print("Failed to add data from Python Model: Does the Python Model have data in the correct format?")

else:
    print("Did not find 'data' in the Vega-Lite schema. Adding data from the Python Model")
    try:
        code["data"] = __dataHandler["${nodeid}"]
    except Exception as e:
        print("Failed to add data from Python Model: Does the Python Model have data in the correct format?")

try:
    display(altair.Chart.from_dict(code), target="${NODE_ID_STRING}${nodeid}")
except Exception as e:
    print("Error in embedding visualisation: ", e)
`
        // Testing Altair
        program = `
from pyscript import display
import altair as alt
from vega_datasets import data

source = data.movies.url

pts = alt.selection_point(encodings=['x'])

rect = alt.Chart(data.movies.url).mark_rect().encode(
    alt.X('IMDB_Rating:Q', bin=True),
    alt.Y('Rotten_Tomatoes_Rating:Q', bin=True),
    alt.Color('count()',
        scale=alt.Scale(scheme='greenblue'),
        legend=alt.Legend(title='Total Records')
    )
)

circ = rect.mark_point().encode(
    alt.ColorValue('grey'),
    alt.Size('count()',
        legend=alt.Legend(title='Records in Selection')
    )
).transform_filter(
    pts
)

bar = alt.Chart(source).mark_bar().encode(
    x='Major_Genre:N',
    y='count()',
    color=alt.condition(pts, alt.ColorValue("steelblue"), alt.ColorValue("grey"))
).properties(
    width=550,
    height=200
).add_params(pts)

alt.renderers.enable("svg")

display(alt.vconcat(rect + circ, bar).resolve_legend(color="independent", size="independent"), target="${NODE_ID_STRING}${nodeid}")

        
`

        this.pythonHandler.runPythonWithoutReturn(program)
    }
}