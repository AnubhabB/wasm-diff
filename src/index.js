import "./style.css";
import { NEW_TXT, OLD_TEXT } from "./data";
import DiffMatchPatch from "diff-match-patch";

let oldtxtarea, newtxtarea;
let jsdiffbutton, wasmdiffbutton;

const dmp = new DiffMatchPatch();

const jsDiff = () => {
    let old_txt = oldtxtarea.value;
    let new_txt = newtxtarea.value;

    // Capturing start time for stats
    let start = Date.now();
    // create our diffs
    let diffs = dmp.diff_main(old_txt, new_txt);
    // Time to complete the diff
    let diff_end = Date.now()
    // this API makes diff more human readable
    dmp.diff_cleanupSemantic(diffs);

    let html = dmp.diff_prettyHtml(diffs);
    let total = Date.now();

    let target = document.getElementById("show-js-diff");
    if(!target) {
        alert("Something went wrong! Reload the page");
        return;
    }

    target.innerHTML = html;
}

const wasmDiff = () => {
    alert("Wasm Diff");
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