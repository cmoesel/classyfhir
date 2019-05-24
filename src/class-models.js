/**
 * A model of a class to generate
 */
class Klass {

  /**
   * Builds a Klass representing a class to generate
   * @param {string} name - the name of the class
   */
  constructor(name) {
    this.name = name;
    this.properties = [];
  }

  /**
   * The name of the class
   * @returns {string}
   */
  get name() { return this._name; }
  /**
   * @param {string} name - the name of the class
   */
  set name(name) { this._name = name; }

  /**
   * The name of the FHIR type
   * @returns {string}
   */
  get fhirName() { return this._fhirName; }
  /**
   * @param {string} fhirName - the name of the FHIR type
   */
  set fhirName(fhirName) { this._fhirName = fhirName; }

  /**
   * The FHIR resource type (if applicatble)
   * @returns {string}
   */
  get resourceType() { return this._resourceType; }
  /**
   * @param {string} resourceType - the FHIR resource type (if applicable)
   */
  set resourceType(resourceType) { this._resourceType = resourceType; }

  /**
   * The name of the superclass
   * @returns {string}
   */
  get superKlass() { return this._superKlass; }
  /**
   * @param {string} superKlass - the name of the superclass
   */
  set superKlass(superKlass) { this._superKlass = superKlass; }

  /**
   * The description of the class
   * @returns {string}
   */
  get description() { return this._description; }
  /**
   * @param {string} [description] - the description of the class
   */
  set description(description) { this._description = description; }

  /**
   * An array of property objects representing properties in the class
   * @returns {Property[]}
   */
  get properties() { return this._properties; }
  /**
   * @param {Property[]} properties - an array of property objects representing properties in the class
   */
  set properties(properties) { this._properties = properties; }
}

/**
 * A model of a property on a klass to generate
 */
class Property {
  /**
   * Builds a Property representing a property to be generated.  This will usually result in
   * the generation of accessors (getters & setters).
   * @param {string} name - the name of the property
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * The name of the property
   * @returns {string}
   */
  get name() { return this._name; }
  /**
   * @param {string} name - the name of the property
   */
  set name(name) { this._name = name; }

  /**
   * The name of the FHIR property
   * @returns {string}
   */
  get fhirName() { return this._fhirName; }
  /**
   * @param {string} fhirName - the name of the FHIR property
   */
  set fhirName(fhirName) { this._fhirName = fhirName; }
}

module.exports = {
  Klass,
  Property
};