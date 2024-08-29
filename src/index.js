import "./style.css";
import { NEW_TXT, OLD_TEXT } from "./data";
import DiffMatchPatch from "diff-match-patch";
import init, { Differ } from "./pkg";


let oldtxtarea, newtxtarea;
let jsdiffbutton, wasmdiffbutton;

// Initializing the JS diff class
const jsdmp = new DiffMatchPatch();

// Initializing the WASM differ
let wsdmp;
init().then(_ => {
    wsdmp = new Differ();
});

// A simple postprocessing function to replace existing styles to suit our cause
// Instead of calling `dmp.diff_prettyHtml()` we should ideally have our own function to format the diff
const diffPrettier = (html) => {
    let cleaned = html.replaceAll("&para;", "")
        .replaceAll(" style=\"background:#ffe6e6;\"", "")
        .replaceAll(" style=\"background:#e6ffe6;\"", "");

    return cleaned;
}

// Calculate diff with the JS module
const jsDiff = () => {
    let old_txt = oldtxtarea.value;
    let new_txt = newtxtarea.value;

    // Capturing start time for stats
    let start = Date.now();
    // create our diffs
    let diffs = jsdmp.diff_main(old_txt, new_txt, true);
    // this API makes diff more human readable
    jsdmp.diff_cleanupSemantic(diffs);
    let html = jsdmp.diff_prettyHtml(diffs);

    let total = Date.now();

    html = diffPrettier(html);

    let target = document.getElementById("show-js-diff");
    let total_time = document.getElementById("js-total-time");
    if(!target || !total_time) {
        alert("Something went wrong! Reload the page");
        return;
    }

    target.innerHTML = html;
    total_time.innerText = `${(total - start)} ms`;
}

const wasmDiff = () => {
    if(!wsdmp) {
        console.error("Error initializing wasm Differ module");
        alert("WASM Differ was not initialized")
        return;
    }

    let old_txt = oldtxtarea.value;
    let new_txt = newtxtarea.value;

    // Capturing start time for stats
    let start = Date.now();
    // create our diffs
    let html = wsdmp.diff(old_txt, new_txt);

    let total = Date.now();

    let target = document.getElementById("show-ws-diff");
    let total_time = document.getElementById("ws-total-time");
    if(!target || !total_time) {
        alert("Something went wrong! Reload the page");
        return;
    }

    target.innerHTML = html;
    total_time.innerText = `${(total - start)} ms`;
}

// Once window is loaded initializing the event listners and binding to specific DOM elements
window.onload = () => {
    // Binding the textarea elements
    oldtxtarea = document.getElementById("old-textarea");
    newtxtarea = document.getElementById("new-textarea");

    // Binding the buttons
    jsdiffbutton = document.getElementById("button-js-diff");
    wasmdiffbutton = document.getElementById("button-wasm-diff");

    // For our demo we are pre-populating the largish text-data here
    if(oldtxtarea && newtxtarea) {
        oldtxtarea.value = OLD_TEXT;
        newtxtarea.value = NEW_TXT;
    }

    // your basic event listners
    jsdiffbutton.onclick = jsDiff;
    wasmdiffbutton.onclick = wasmDiff;
}