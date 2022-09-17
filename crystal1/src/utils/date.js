import moment from "moment";

export const date2str = (date) => {
	return moment(date).format("h:mm A MM/DD/YYYY");
};
