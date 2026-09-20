import { SelectorClass, MCFunction, functionCmd, Data, DataPointClass, raw } from "sandstone";
import { Macroable, MacroClass } from "./macro";


export class PGTellrawClass {
  private static instanceCounter: number = 0;
  player: Macroable<SelectorClass | string>;
  textComponents: Macroable<string>[];
  storageTarget: DataPointClass<'storage'>;

  constructor(textComponents: Macroable<string>[], player?: Macroable<SelectorClass | string>) {
    this.textComponents = textComponents;
    this.player = player ?? '@a';

    PGTellrawClass.instanceCounter++;
    this.storageTarget = Data('storage', 'prodigelib:prodigelib', 'tellraw')
      .select(`tellraw_${PGTellrawClass.instanceCounter}`);
  }

  private serializeTextComponents(): string {
    const formattedComponents = this.textComponents.map(s => {
      const sanitized = String(s).replace(/\r?\n/g, '\\n');
      return `{text: "${sanitized}"}`;
    });
    return `[${formattedComponents.join(', ')}]`;
  }

  build() {
    const formattedJson = this.serializeTextComponents();

    for (const arg of MacroClass.pendingMacroArgs) {
      this.storageTarget.select(arg.key).set(arg.value);
    }

    if (MacroClass.pendingMacroArgs.length > 0) {
      const macroFunction = MCFunction(`__lib/easymacro/tellraw/${PGTellrawClass.instanceCounter}`, () => {
        raw(`$tellraw ${this.player} ${formattedJson}`);
      });

      functionCmd(macroFunction, 'with', 'storage', this.storageTarget.currentTarget, this.storageTarget.path);
    } else {
      // Exécution directe sans overhead de macro s'il n'y a pas de variables
      raw(`tellraw ${this.player} ${formattedJson}`);
    }

    MacroClass.pendingMacroArgs = [];
    MacroClass.id = 0;
  }
}

/**
 * Fonction helper d'exécution pour envoyer un tellraw compatible avec les macros
 */
export function PGTellraw(
  textComponents: Macroable<string>[],
  player?: Macroable<SelectorClass | string>
) {
  return new PGTellrawClass(textComponents, player).build();
}