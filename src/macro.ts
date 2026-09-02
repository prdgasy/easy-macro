import { MacroTellrawClass } from "./tellraw";

export type Macroable<T> = T | MacroClass;


export class MacroClass {
  static pendingMacroArgs: MacroClass[] = [];

  static id: number = 0;

  key: string;
  value: any;

  constructor(value: any) {
    this.value = value;

    MacroClass.id++;
    this.key = `EasyMacro_${MacroClass.id}`;

    MacroClass.pendingMacroArgs.push(this);
  }

  toString() {
    return `$(${this.key})`;
  }
}

// 1. 🟢 On ajoute les surcharges (Overloads) pour guider TypeScript
export function macro(strings: TemplateStringsArray, ...values: any[]): string;
export function macro(value: any): MacroClass;

// 🟢 Fonction hybride qui gère l'appel normal ET le Tagged Template
export function macro(stringsOrValue: any, ...values: any[]): any {
  // 1. Si appelée comme Tagged Template Literal: $`texte ${valeur}`
  if (Array.isArray(stringsOrValue) && 'raw' in stringsOrValue) {
    const strings = stringsOrValue as TemplateStringsArray;
    let result = strings[0];

    for (let i = 0; i < values.length; i++) {
      let val = values[i];

      if (val instanceof MacroClass) {
        // C'est déjà une macro, on ne fait rien de plus

      } else if (typeof val === 'function' || (val !== null && typeof val === 'object' && !Array.isArray(val))) {
        // C'est un Score ou un Data Point (objet non array), on l'encapsule !
        val = new MacroClass(val);
      }

      result += String(val) + strings[i + 1];
    }

    return result; // Retourne "Level $(macroArg_0)"
  }

  // 2. Appel classique : $(valeur)
  if (stringsOrValue instanceof MacroClass) {
    throw Error(`${stringsOrValue} is already a Macro.`);
  }

  return new MacroClass(stringsOrValue);
}