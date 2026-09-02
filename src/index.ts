import { DataVariable, MCFunction, say, Variable } from "sandstone";
import { macro as $ } from "./macro";
import { richTellraw } from "./tellraw";


MCFunction('load', () => {
  richTellraw([
    $`Hello world ${Variable(1)}`,
    $`${DataVariable("hello").set("a")}`
  ]);

  richTellraw([
    $`Hello world 2 ${Variable(0)}`
  ])
}, { runOnLoad: true })