const {expect} = require('chai');
const BaseInstance = require('../src/BaseInstance');

// Placeholder test
describe('#BaseInstance()', () => {
  it('should get extensions by URL', () => {
    const json = require('./fixtures/dstu2/Adriana394_Herman763_10130c25-a664-4f1a-905a-5d58f74af962.json');
    const bsd = new BaseInstance(json.entry[0].resource);
    const ext = bsd.findExtensions('http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex');
    expect(ext).to.eql([{
      url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
      valueCode: 'F'
    }]);
  });

  it('should get extension by URL', () => {
    const json = require('./fixtures/dstu2/Adriana394_Herman763_10130c25-a664-4f1a-905a-5d58f74af962.json');
    const bsd = new BaseInstance(json.entry[0].resource);
    const ext = bsd.findExtension('http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex');
    expect(ext).to.eql({
      url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
      valueCode: 'F'
    });
  });
});
