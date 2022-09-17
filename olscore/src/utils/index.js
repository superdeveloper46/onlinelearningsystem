import moment from "moment";

export const date2str = (date) => {
  return moment(date).format("MMMM D, YYYY [at] h:mm A");
};
