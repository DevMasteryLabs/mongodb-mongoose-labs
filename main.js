require('dotenv').config();


let User; // This variable must receive the User Model




const createAndSaveUser = (done) => {

};

const createManyUsers = (arrayOfUsers, done) => {

};

const findUsersByLastName = (userLastName, done) => {

};

const findOneUserBySpokenLanguage = (language, done) => {

};

const findUserById = (userId, done) => {

};

const findEditThenSave = (userId, done) => {
  const languageToAdd = "spanish";

};

const findAndUpdate = (userEmail, done) => {
  const birthYearToSet = 1970;

};

const removeById = (userId, done) => {

};

const removeManyUsers = (done) => {
  const birthYearToRemove = 2000;

};

const queryChain = (done) => {
  const languageToSearch = "english";

};


//----- # PLEASE DO NOT EDIT BELOW THIS LINE # -----

exports.UserModel = User;
exports.createAndSaveUser = createAndSaveUser;
exports.findUsersByLastName = findUsersByLastName;
exports.findOneUserBySpokenLanguage = findOneUserBySpokenLanguage;
exports.findUserById = findUserById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyUsers = createManyUsers;
exports.removeById = removeById;
exports.removeManyUsers = removeManyUsers;
exports.queryChain = queryChain;
