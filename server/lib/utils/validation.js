const special = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
const whitespace = new RegExp(/\s/);
const startSpace = new RegExp(/^\s/);
const endSpace = new RegExp(/\s$/);

const getLeagueNameError = (name) => {

  if(typeof name !== 'string')
    return 'league name must be a string';

  if(name.length < 4 || name.length > 32)
    return 'league name must be between 4 and 32 characters long';

  if(special.test(name))
    return 'league name cannot contain special characters';

  if(startSpace.test(name) || endSpace.test(name))
    return 'league name cannot start or end with whitespace';

  return '';
};

const getUsernameError = (username) => {

  if(typeof username !== 'string')
    return 'username must be a string';

  if(username.length < 4 || username.length > 16)
    return 'username must be between 4 and 16 characters long';

  if(special.test(username))
    return 'username cannot contain special characters';

  if(whitespace.test(username))
    return 'username cannot contain whitespace';

  return '';
};

const getPasswordError = (password) => {

  if(typeof password !== 'string')
    return 'password must be a string';

  if(password.length < 8 || password.length > 32)
    return 'password must be between 8 and 32 characters long';

  return '';
};

export const validateLogin = ({ username, password }) => {

  const usernameError = getUsernameError(username);
  if(usernameError)
    return { success: false, message: usernameError };

  const passwordError = getPasswordError(password);
  if(passwordError)
    return { success: false, message: passwordError };

  return { success: true };
};

export const validateSignup = ({ username, password, confirm }) => {

  const usernameError = getUsernameError(username);
  if(usernameError)
    return { success: false, message: usernameError };

  const passwordError = getPasswordError(password);
  if(passwordError)
    return { success: false, message: passwordError };

  if(password !== confirm)
    return { success: false, message: 'passwords do not match' };

  return { success: true };
};

export const validateLeagueName = (leagueName) => {

  const nameError = getLeagueNameError(leagueName);
  if(nameError)
    return { success: false, message: nameError };

  return { success: true };
};