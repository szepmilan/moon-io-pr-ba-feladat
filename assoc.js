const db = require("./models");
const { User, Parcel} = db;

const getModelAccessorMethods = (model) => {
  console.log(`${model.name}:`);
  Object.entries(model.associations).forEach(([_, associatedModel]) => {
    Object.entries(associatedModel.accessors).forEach(([action, accessor]) => {
      console.log(`  ${action}: ${model.name}.${accessor}(...)`);
    });
  });
};

(async () => {
  getModelAccessorMethods(User);
  getModelAccessorMethods(Parcel);
})();
