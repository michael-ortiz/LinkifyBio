export const validateAlias = (alias) => {
  if (alias === '') {
    console.log('alias is empty', alias);
    return false;
  }

  if (alias.includes(' ')) {
    console.log('alias contains a space', alias);

    return false;
  }

  if (!/^[a-zA-Z0-9-]*$/.test(alias)) {
    console.log('alias contains invalid characters', alias);

    return false;
  }

  if (alias.length > 120) {
    console.log('alias is too long', alias);
    return false;
  }

  return true;
};
