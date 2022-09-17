import moment from "moment";

export function fixStringNewline(strInput) {
  var strOutput = strInput.replaceAll("\r\n", "<br/>");
  strOutput = strOutput.replaceAll("\n", "<br/>");
  return strOutput.replaceAll("\r", "<br/>");
}

export function getDueDateString(date) {
  return moment(date).format("MMMM D, YYYY [at] h:mm a");
}

const utils = { fixStringNewline, getDueDateString };

export default utils;
