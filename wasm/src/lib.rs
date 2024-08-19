use diff_match_patch_rs::dmp::DiffMatchPatch;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default)]
pub struct Differ {
    dmp: DiffMatchPatch,
}

#[wasm_bindgen]
impl Differ {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        
        let dmp = DiffMatchPatch::default();
        Self {
            dmp
        }
    }

    pub fn diff(&self, old: &str, new: &str) -> Result<String, String> {
        let diffs = match self.dmp.diff_main(old, new) {
            Ok(d) => d,
            Err(_) => {
                return Err("error while diffing".to_string())
            }
        };

        let html = match DiffMatchPatch::diff_pretty_html(&diffs[..]) {
            Ok(s) => s,
            Err(_) => {
                return Err("Error preparing HTML".to_string())
            }
        };

        Ok(html)
    }
}