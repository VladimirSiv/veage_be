setExposeHeaders = (res) => {
  const rawValue = res.getHeader("Access-Control-Expose-Headers") || "";
  if (typeof rawValue !== "string") {
    return;
  }
  const headers = new Set(
    rawValue
      .split(",")
      .map((header) => header.trim())
      .filter((header) => Boolean(header))
  );
  headers.add("Content-Range");
  headers.add("X-Total-Count");
  res.header("Access-Control-Expose-Headers", [...headers].join(", "));
};

setListHeaders = (res, offset, rowsCount, total) => {
  setExposeHeaders(res);
  res.header("Content-Range", `${offset}-${offset + rowsCount}/${total}`);
  res.header("X-Total-Count", `${total}`);
};

module.exports = setListHeaders;
