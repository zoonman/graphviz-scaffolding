import * as hpccWasm from '@hpcc-js/wasm';

/**
 * A shorthand converting dot text into html
 * @param dot
 */
const dot2svg = async (dot: string): Promise<string> => {
    return hpccWasm
        .graphviz
        .layout(
            dot,
            'svg',
            'dot' // one of "circo" | "dot" | "fdp" | "sfdp" | "neato" | "osage" | "patchwork" | "twopi"
        );
};


/***
 * Application
 */
export const app = () => {

    // we have to configure serving folder for our app
    // right now it is webservers root (see *.wasm files in dist/ dir)
    hpccWasm.wasmFolder('/');

    // locate body element
    const bodyElms = document.getElementsByTagName('body');

    // let create our div, we don't have to do it often
    const divElement = document.createElement('div');
    divElement.setAttribute('id', 'main'); // some id to a DIV element
    bodyElms[0].appendChild(divElement); // add newly created div as child for BODY

    /**
     *  this is a initial DOT text for out diagram
     */
    const dotData = 'digraph G { a->b[label=0] }';

    /**
     * Closure with bound DIV DOM element
     * Simplifies interaction with
     *
     * */
    const renderDot = (dot: string) => {
        dot2svg(dot)
            .then(html => divElement.innerHTML = html)
            .catch(console.log);
    };

    // let's call it
    renderDot(dotData);

    /**
     * Random in range [0..1] with fixed length
     * @param fractionDigits
     */
    const random1 = (fractionDigits: number): string => {
        return Math.random().toFixed(fractionDigits);
    }

    /**
     * A simple random color generator for HSV colorspace
     */
    const randomHsvColor = () => {
        return [
            random1(3),
            random1(3),
            random1(3)
        ].join(' ');
    };



    // run scheduler which will update graph every second
    setInterval(() => {

        // some dynamic data
        const dotData = `digraph G { 
            a->b[label= ${random1(2)}] 
            b->c[label= ${random1(2)} color="${randomHsvColor()}"] 
            b->d[label= ${random1(2)}] 
            a->d[label= ${random1(2)} color="${randomHsvColor()}"] 
            Sun[color=yellow style = filled]
            Moon[color=gold style = filled]
            Earth[color=lightblue style = filled]
            Sun->Earth[label= ${random1(2)} color="${randomHsvColor()}"] 
            Moon->Earth[label= ${random1(2)} color="${randomHsvColor()}"] 
        }`;

        // render new dot file
        renderDot(dotData);

    }, 1000); // time in ms
};
