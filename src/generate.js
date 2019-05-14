const fs = require('fs-extra');
const path = require('path');
const load = require('./load');
const CodeWriter = require('./CodeWriter');

const DSTU2_DEFS = load('dstu2');

function generate() {
  generateDSTU2();
}

function generateDSTU2() {
  const genPath = path.join(__dirname, 'generated', 'dstu2');
  fs.mkdirpSync(genPath);
  // NOTE: Currently only generating the resources (no extensions, datatypes, or profiles)
  for (const resource of DSTU2_DEFS.resources) {
    generateDSTU2StructDef(resource);
  }
}

function generateDSTU2StructDef(resource) {
  const cw = new CodeWriter();
  const clazzName = mkClassName(resource.id);
  let superClass;
  if (resource.base) {
    // TODO: More sophisticated approach
    superClass = mkClassName(resource.base.slice(resource.base.lastIndexOf('/')+1));
    cw.ln(`import ${superClass} from '${superClass}';`).ln();
  }
  cw.blComment(() => {
    if (resource.description && resource.description.trim().length > 0) {
      cw.ln(resource.description).ln();
    }
    cw.ln(`This class was generated from the FHIR DSTU2 ${resource.id} StructureDefinition.`).ln();
    if (superClass) {
      cw.ln(`@extends ${superClass}`);
    }
  });
  cw.bl(`class ${clazzName}${superClass ? ` extends ${superClass}` : ''}`, () => {
    //generateClassBody(def, cw);
  });
  cw.ln().ln(`export default ${clazzName};`);
  fs.writeFileSync(path.join(__dirname, 'generated', 'dstu2', `${clazzName}.js`), cw.toString());
}

function mkClassName(name) {
  return name.split(/[-_]/).map(capitalize).join('');
}

function capitalize(str) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

generate();