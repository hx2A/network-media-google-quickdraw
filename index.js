const debug = require('debug')('itp');

const app = require('_/app');

const PORT = 8080;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
