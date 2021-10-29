function fillSubs(recData, subs) {
  const filledSubs = [];
  for (let sub of subs) {
    const fromIndex = recData.route.indexOf(sub.route[0]);
    const toIndex = recData.route.indexOf(sub.route[1]);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      filledSubs.push({Body: recData.Body, ...sub});
    }
  }
  return filledSubs;
}

module.exports = fillSubs;