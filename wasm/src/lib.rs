use diffmatchpatch::{DiffMatchPatch, ToChars};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Differ {
    dmp: DiffMatchPatch,
}

#[wasm_bindgen]
impl Differ {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        log("Initializing");
        console_error_panic_hook::set_once();
        
        let dmp = DiffMatchPatch {
            diff_timeout: None,
            ..Default::default()
        };
        Self {
            dmp
        }
    }

    pub fn diff(&self, old: &str, new: &str) -> String {
        log("Got data!");
        let old = old.to_chars();
        let new = new.to_chars();

        log("Got chars!");

        let mut diffs = self.dmp.diff_main(&old[..], &new[..], true);
        log("Got diffs");
        self.dmp.diff_cleanup_semantic(&mut diffs);

        self.dmp.diff_to_html(&diffs[..])
    }
}

#[cfg(test)]
mod tests {
    use wasm_bindgen_test::wasm_bindgen_test;

    use super::Differ;

    #[wasm_bindgen_test]
    fn test_diff() {
        let differ = Differ::new();
        let old = "Let's start with some basics 😊. We've got your standard smiley face 🙂, your sad face ☹️, and your angry face 😠. But wait, there's more! 🤩 We've also got some more complex emotions like 😍, 🤤, and 🚀. And let's not forget about the classics: 😉, 👍, and 👏.";
        let new = "Now, let's explore some emotional extremes 🌊. We've got your ecstatic face 🤩, your devastated face 😭, and your utterly confused face 🤯. But that's not all! 🤔 We've also got some subtle emotions like 😐, 🙃, and 👀.";

        let diffs = differ.diff(old, new);
        
        println!("{diffs}");
    }
}