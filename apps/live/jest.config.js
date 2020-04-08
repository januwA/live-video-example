module.exports = {
  name: 'live',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/live',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
