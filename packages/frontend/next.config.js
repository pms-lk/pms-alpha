const withTM = require("next-transpile-modules")(["@pms-alpha/common"]);

module.exports = withTM({
  images: {
    domains: ["localhost"],
  },
});
