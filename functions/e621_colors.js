module.exports.colors = function(rating) {
  if (rating == 's') {
    return "#00ff0d";
  } else if (rating == 'q') {
    return "#636363";
  } else if (rating == 'e') {
    return "#ff0800";
  }
}