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
  // Copy over handwritten files
  fs.copyFileSync(path.join(__dirname, 'BaseInstance.js'), path.join(genPath, 'BaseInstance.js'));
  // NOTE: Currently only generating the resources (no extensions, datatypes, or profiles)
  for (const resource of DSTU2_DEFS.resources) {
    generateDSTU2StructDef(resource);
  }
}

function generateDSTU2StructDef(resource) {
  const cw = new CodeWriter();
  const clazzName = getClassName(resource.id);
  const superClass = resource.base ? getClassNameFromURL(resource.base) : 'BaseInstance';
  cw.ln(`import ${superClass} from '${superClass}';`).ln();

  cw.blComment(() => {
    if (resource.description && resource.description.trim().length > 0) {
      cw.ln(resource.description).ln();
    }
    cw.ln(`This class was generated from the FHIR DSTU2 ${resource.id} StructureDefinition.`).ln();
    cw.ln(`@extends ${superClass}`);
  });
  cw.bl(`class ${clazzName} extends ${superClass}`, () => {
    generateDSTU2ClassBody(resource, cw);
  });
  cw.ln().ln(`export default ${clazzName};`);
  fs.writeFileSync(path.join(__dirname, 'generated', 'dstu2', `${clazzName}.js`), cw.toString());
}

function generateDSTU2ClassBody(resource, cw) {
  const resourceType = resource.snapshot.element[0].path;
  cw.ln().bl(`constructor(json = { resourceType: '${resourceType}' })`, () => {
    cw.ln('super(json);');
  });

  for (const el of resource.differential.element) {
    // Only generate for the top-level paths in the differential
    // TODO: support friendly approaches to slicing
    // TODO: support toFHIR()
    // TODO: support validation (?)
    const relativePath = el.path.slice(resourceType.length+1);
    if (relativePath.length > 0 && relativePath.indexOf('.') === -1) {
      cw.ln();
      generateDSTU2Accessor(relativePath, el, cw);
    }
  }
}

function generateDSTU2Accessor(name, el, cw) {
  // TODO: Proper support of class instances
  // TODO: Detection of cardinality (array or not)
  // TODO: Support for choice
  // TODO: Type validation (?)
  const nameToken = tokenize(name);
  cw.blComment(() => {
    cw.ln(`Get the ${name}.`);
    cw.ln('TODO: Return class instances of data');
    cw.ln(`@returns {*}`);
  });
  cw.bl(`get ${nameToken}()`, () => {
    if (/\[x\]$/.test(name)) {
      cw.ln('// TODO: Proper support for choices');
    }
    cw.ln(`return this._json['${name}'];`);
  });
  cw.ln();

  cw.blComment(() => {
    cw.ln(`Set the ${name}.`);
    cw.ln('TODO: Set class instances of data');
    cw.ln(`@param {*} ${name}`);
  });
  cw.bl(`set ${nameToken}(${nameToken})`, () => {
    if (/\[x\]$/.test(name)) {
      cw.ln('// TODO: Proper support for choices');
    }
    cw.ln(`this._json['${name}'] = ${nameToken};`);
  });
  cw.ln();
}

function getClassName(name) {
  return tokenize(name, true);
}

function getClassNameFromURL(url) {
  return getClassName(url.slice(url.lastIndexOf('/')+1));
}

function tokenize(str, pascalCase = false) {
  const pascal = str.replace(/\[x\]$/, '').split(/[^A-Za-z0-9]/).map(upperFirst).join('');
  return pascalCase ? pascal : lowerFirst(pascal);
}

function lowerFirst(str) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
}

function upperFirst(str) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

generate();