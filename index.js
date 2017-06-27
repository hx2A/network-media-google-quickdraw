const debug = require('debug')('itp');

const config = require('_/config')
const app = require('_/app');

const PORT = config.portNumber;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
