const Unique = (a: Array<any>): Array<any> => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

export default {
  Unique,
};
