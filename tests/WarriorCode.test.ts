import WarriorCode from '../WarriorCode';
import Advance from '@civ-clone/core-science/Advance';
import { instance as advanceRegistry } from '@civ-clone/core-science/AdvanceRegistry';
import { instance as ruleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { existsSync, readFileSync } from 'fs';
import { expect } from 'chai';
import { join } from 'path';
import { typeNameOf } from '@civ-clone/core-data-object/DataObject';

describe('WarriorCode', (): void => {
  it('should extend Advance directly', (): void => {
    expect(Object.getPrototypeOf(WarriorCode)).to.equal(Advance);
  });

  it('should be saved by its own name', (): void => {
    expect(typeNameOf(WarriorCode)).to.equal('WarriorCode');
  });

  it('should be a library that registers nothing', (): void => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );

    ['main', 'module', 'exports', 'bin'].forEach((field: string): void => {
      expect(packageJson).not.to.have.property(field);
    });
    expect(existsSync(join(process.cwd(), 'index.ts'))).to.be.false;
    expect(existsSync(join(process.cwd(), 'index.js'))).to.be.false;

    const entries = (): unknown[][] => [
        ruleRegistry.entries(),
        advanceRegistry.entries(),
      ],
      before = entries(),
      path = require.resolve('../WarriorCode');

    // Load the module afresh, as a plugin loader importing it would.
    delete require.cache[path];
    require(path);

    const after = entries();

    after.forEach((list: unknown[], index: number): void => {
      expect(list).to.have.ordered.members(before[index]);
    });
  });
});
