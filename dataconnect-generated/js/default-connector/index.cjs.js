const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'resultapp',
  location: 'europe-central2'
};
exports.connectorConfig = connectorConfig;

