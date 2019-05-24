const fhirpath = require('fhirpath');

/**
 * A base instance of any FHIR-based class, with helpful methods for manipulating the data.
 */
class BaseInstance {
  /**
   * Base constructor intended to be invoked by subclasses.
   * @param {Object} json - a JSON instance of FHIR data
   */
  constructor(json = {}) {
    this._json = json;
  }

  /**
   * Evaluates a FHIRPath expression against the FHIR data
   * @param {string} path - the path to evaluate
   * @param {Object} context - the context containing environment variables
   * @returns {*} the result of the FHIRPath expression
   */
  fhirpath(path, context) {
    return fhirpath.evaluate(this._json, path, context);
  }

  /**
   * Find extensions by URL. As some profiles may allow multiples of the same extension type,
   * this function may return more than one extension instance. To find only a single instance
   * of an extension, @see findExtension.
   * @param {string} url - the extension URL indicating the type of extensions to find
   * @returns {Object[]} all instances of extensions matching the input URL
   */
  findExtensions(url) {
    return this.fhirpath(`extension.where(url = '${url}')`);
  }

  /**
   * Find an extension by URL. If multiple matching extensions are found, only the first is
   * returned. To find multiple instance of an extension, @see findExtensions.
   * @param {string} url - the extension URL to find a single instance for
   * @returns {Object} the matching extension, if found
   */
  findExtension(url) {
    const result = this.fhirpath(`extension.where(url = '${url}').first()`);
    if (result.length) {
      return result[0];
    }
  }
}

module.exports = BaseInstance;