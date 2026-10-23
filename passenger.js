const path = require("path");

// Passenger starts from the project root. The standalone Next server carries
// the production runtime and its dependencies alongside it.
const runtimeRoot = path.join(__dirname, ".next", "standalone");
process.chdir(runtimeRoot);
require(path.join(runtimeRoot, "server.js"));
