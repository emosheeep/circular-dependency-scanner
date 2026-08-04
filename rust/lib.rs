#![deny(clippy::all)]

use graph_cycles::Cycles;
use petgraph::graph::DiGraph;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(typescript_type = "[string, string[]][]")]
  pub type Edges;

  #[wasm_bindgen(typescript_type = "string[][]")]
  pub type CycleResult;
}

#[wasm_bindgen]
pub fn analyze_graph(edges_array: Edges) -> Result<CycleResult, JsError> {
  let edges: Vec<(String, Vec<String>)> = serde_wasm_bindgen::from_value(edges_array.obj)?;
  let cycles = find_cycles(&edges);

  Ok(CycleResult {
    obj: serde_wasm_bindgen::to_value(&cycles)?,
  })
}

fn find_cycles(edges: &[(String, Vec<String>)]) -> Vec<Vec<String>> {
  let mut graph = DiGraph::<(), ()>::new();
  let mut node_map = HashMap::new();
  let mut nodes = Vec::new();

  // Build the graph, replace string with number index to save runtime memory.
  for (source, targets) in edges {
    let source_idx = *node_map.entry(source.as_str()).or_insert_with(|| {
      let idx = graph.add_node(());
      nodes.push(source.as_str());
      idx
    });

    for target in targets {
      let target_idx = *node_map.entry(target.as_str()).or_insert_with(|| {
        let idx = graph.add_node(());
        nodes.push(target.as_str());
        idx
      });
      graph.update_edge(source_idx, target_idx, ());
    }
  }

  graph
    .cycles()
    .into_iter()
    .map(|cycle| {
      cycle
        .into_iter()
        .map(|node_idx| nodes[node_idx.index()].to_string())
        .collect()
    })
    .collect()
}

#[cfg(test)]
mod tests {
  use super::find_cycles;

  fn graph<const N: usize>(edges: [(&str, &[&str]); N]) -> Vec<(String, Vec<String>)> {
    edges
      .into_iter()
      .map(|(source, targets)| {
        (
          source.to_string(),
          targets.iter().map(|target| target.to_string()).collect(),
        )
      })
      .collect()
  }

  fn normalized_cycles(edges: &[(String, Vec<String>)]) -> Vec<Vec<String>> {
    let mut cycles = find_cycles(edges);
    for cycle in &mut cycles {
      let anchor = cycle
        .iter()
        .enumerate()
        .min_by(|(_, left), (_, right)| left.cmp(right))
        .unwrap()
        .0;
      cycle.rotate_left(anchor);
    }
    cycles.sort_by(|left, right| left.len().cmp(&right.len()).then_with(|| left.cmp(right)));
    cycles
  }

  #[test]
  fn acyclic_graph_has_no_cycles() {
    let edges = graph([("a", &["b"]), ("b", &["c"])]);

    assert!(find_cycles(&edges).is_empty());
  }

  #[test]
  fn finds_a_cycle() {
    let edges = graph([("a", &["b"]), ("b", &["a"])]);

    assert_eq!(normalized_cycles(&edges), [["a", "b"]]);
  }

  #[test]
  fn finds_a_self_cycle() {
    let edges = graph([("a", &["a"])]);

    assert_eq!(find_cycles(&edges), [["a"]]);
  }

  #[test]
  fn finds_cycles_in_disconnected_components() {
    let edges = graph([("a", &["b"]), ("b", &["a"]), ("c", &["c"])]);

    assert_eq!(normalized_cycles(&edges), [["c"].as_slice(), &["a", "b"]]);
  }

  #[test]
  fn ignores_duplicate_dependencies() {
    let edges = graph([("a", &["b", "b"]), ("b", &["a", "a"])]);

    assert_eq!(normalized_cycles(&edges), [["a", "b"]]);
  }

  #[test]
  fn finds_overlapping_cycles_regardless_of_input_order() {
    // Ported from grantila/graph-cycles' initialGraph fixture:
    // https://github.com/grantila/graph-cycles/blob/master/lib/index.test.ts
    let graph = graph([
      ("a", &["b", "c"]),
      ("b", &["c", "j"]),
      ("c", &["d"]),
      ("d", &["e", "h"]),
      ("e", &["f", "g"]),
      ("f", &["d", "k"]),
      ("g", &["g", "h"]),
      ("h", &["i"]),
      ("i", &["c"]),
      ("j", &[]),
      ("k", &["l"]),
      ("m", &["l"]),
      ("l", &[]),
      ("x", &["y"]),
      ("z", &["x", "y"]),
    ]);
    let expected = [
      &["g"][..],
      &["d", "e", "f"],
      &["c", "d", "h", "i"],
      &["c", "d", "e", "g", "h", "i"],
    ];

    for offset in 0..graph.len() {
      let mut rotated = graph.clone();
      rotated.rotate_left(offset);
      assert_eq!(normalized_cycles(&rotated), expected);

      for (_, targets) in &mut rotated {
        targets.reverse();
      }
      assert_eq!(normalized_cycles(&rotated), expected);
    }
  }
}
