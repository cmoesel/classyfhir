const fs = require('fs-extra');
const path = require('path');
const reserved = require('reserved-words');
const prettier = require('prettier');
const load = require('./load');
const CodeWriter = require('./CodeWriter');
const {Klass, Property} = require('./class-models');

const DSTU2_DEFS = load('dstu2');

/**
 * Generate ES6 classes from FHIR definitions.
 */
function generate() {
  generateDSTU2();
}

/**
 * Generate ES6 classes from FHIR DSTU2 definitions
 */
function generateDSTU2() {
  const genPath = path.join(__dirname, 'generated', 'dstu2');
  fs.mkdirpSync(genPath);

  // Copy over handwritten files
  const baseInstance = fs.readFileSync(path.join(__dirname, 'BaseInstance.js'), { encoding: 'utf8'});
  fs.writeFileSync(path.join(genPath, 'BaseInstance.js'), prettier.format(baseInstance, { singleQuote: true, parser: 'babel' }));

  // NOTE: Currently only generating the resources (no extensions, datatypes, or profiles)
  for (const resource of DSTU2_DEFS.resources) {
    const klass = buildKlass(resource);
    generateKlass(klass);
  }
}

/**
 * Builds a representation of the class to generate
 * @param {Object} resource - a StructureDefinition JSON object to generate a class for
 */
function buildKlass(resource) {
  const klass = new Klass(getClassName(resource.id));
  klass.fhirName = resource.id;
  klass.resourceType = resource.snapshot.element[0].path;
  klass.superKlass = resource.base ? getClassNameFromURL(resource.base) : 'BaseInstance';
  if (resource.description && resource.description.trim().length > 0) {
    klass.description = resource.description;
  }
  for (const el of resource.differential.element) {
    const relativePath = el.path.slice(klass.resourceType.length+1);
    if (relativePath.length > 0 && relativePath.indexOf('.') === -1) {
      const property = new Property(tokenize(relativePath));
      property.fhirName = relativePath;
      klass.properties.push(property);
    }
  }
  return klass;
}

/**
 * Generates the ES6 class for the given class representation
 * @param {Klass} klass - the class to generate an ES6 class for
 */
function generateKlass(klass) {
  const cw = new CodeWriter();
  cw.ln(`import ${klass.superKlass} from '${klass.superKlass}';`).ln();

  cw.blComment(() => {
    if (klass.description) {
      cw.ln(klass.description).ln();
    }
    cw.ln(`This class was generated from the FHIR DSTU2 ${klass.fhirName} StructureDefinition.`).ln();
    cw.ln(`@extends ${klass.superKlass}`);
  });
  cw.bl(`class ${klass.name} extends ${klass.superKlass}`, () => {
    cw.blComment(() => {
      cw.ln(`Builds a ${klass.name} representing an instance of a FHIR DSTU2 ${klass.fhirName}.`);
      cw.ln(`@param {Object} [json] - JSON instance of a FHIR DSTU2 ${klass.fhirName}`);
    });
    cw.ln().bl(`constructor(json = { resourceType: '${klass.resourceType}' })`, () => {
      cw.ln('super(json);');
    });
    cw.ln();
    klass.properties.forEach(p => generateAccessors(p, cw));
  });
  cw.ln().ln(`export default ${klass.name};`);
  fs.writeFileSync(path.join(__dirname, 'generated', 'dstu2', `${klass.name}.js`), cw.toString());
}

/**
 * Generates the ES6 accessors for the property representation
 * @param {Property} property
 * @param {CodeWriter} cw
 */
function generateAccessors(property, cw) {
  cw.blComment(() => {
    cw.ln(`Get the ${property.fhirName}.`);
    cw.ln('TODO: Return class instances of data');
    cw.ln(`@returns {*}`);
  });
  cw.bl(`get ${property.name}()`, () => {
    if (/\[x\]$/.test(property.fhirName)) {
      cw.ln('// TODO: Proper support for choices');
    }
    cw.ln(`return this._json['${property.fhirName}'];`);
  });
  cw.ln();

  cw.blComment(() => {
    cw.ln(`Set the ${property.fhirName}.`);
    cw.ln('TODO: Set class instances of data');
    cw.ln(`@param {*} ${property.name}`);
  });
  cw.bl(`set ${property.name}(${property.name})`, () => {
    if (/\[x\]$/.test(property.fhirName)) {
      cw.ln('// TODO: Proper support for choices');
    }
    cw.ln(`this._json['${property.fhirName}'] = ${property.name};`);
  });
  cw.ln();
}

/**
 * Gets a class name from a FHIR type name.  This will remove invalid characters
 * and ensure the first letter is capitalized.
 * @param {string} name - the name of the FHIR type
 * @returns {string} the class name
 */
function getClassName(name) {
  return tokenize(name, true);
}

/**
 * Gets a class name from a FHIR URL.  This will remove invalid characters
 * and ensure the first letter is capitalized.
 * @param {string} url - the canonical URL for the FHIR type
 * @returns {string} the class name
 */
function getClassNameFromURL(url) {
  return getClassName(url.slice(url.lastIndexOf('/')+1));
}

/**
 * Gets a tokenized version of the string converted to camel-case (or pascal-case)
 * @param {string} str - the string to tokenize
 * @param {boolean} [pascalCase=false] - indicates if the token should be pascal-case
 * @returns {string} the token
 */
function tokenize(str, pascalCase = false) {
  const pascal = str.replace(/\[x\]$/, '').split(/[^A-Za-z0-9]/).map(upperFirst).join('');
  let token = pascalCase ? pascal : lowerFirst(pascal);
  if (reserved.check(token, 'es2015', true)) {
    token = `${token}_`;
  }
  return token;
}

/**
 * Lowercases the first letter of a string
 * @param {string} str - the string to lowercase the first letter for
 * @returns {string} with the first letter lowercased
 */
function lowerFirst(str) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
}

/**
 * Uppercases the first letter of a string
 * @param {string} str - the string to uppercase the first letter for
 * @returns {string} with the first letter uppercased
 */
function upperFirst(str) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

generate();