let Utilities = {
  // Clean CSS Identifier name.
  cleanCssIdentifier: function (name) {
    return name.toLowerCase().replace(/[\s_!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '-');
  }
};

export default Utilities;
