import { DataPointClass, Score } from "sandstone";

export type Macroable<T> = T | MacroClass;
export type CanBeMacro = DataPointClass | Score;
export class MacroClass {
  static pendingMacroArgs: MacroClass[] = [];

  static id: number = 0;

  key: string;
  value: CanBeMacro;

  constructor(value: CanBeMacro) {
    this.value = value;

    MacroClass.id++;
    this.key = `EasyMacro_${MacroClass.id}`;

    MacroClass.pendingMacroArgs.push(this);
  }

  toString() {
    return `$(${this.key})`;
  }
}

export function macro(strings: TemplateStringsArray, ...values: any[]): string {
  let result = strings.raw[0];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    const isMacro = (v instanceof DataPointClass) || (v instanceof Score);
    result += String(isMacro ? new MacroClass(v) : v) + strings.raw[i + 1];
  }

  return result;
}