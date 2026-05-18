import { v4 as uuidv4 } from "uuid";

export const buildParams = (params) => {
	const keys = Object.keys(params);
	if (keys.length == 0) return "";
	return (
		"?" +
		keys
			.map((key) => {
				return `${key}=${params[key]}`;
			})
			.join("&")
	);
};

export const makeid = () => {
	return uuidv4();
};

export const deepCopy = (params) => {
	return JSON.parse(JSON.stringify(params));
};

export const convertBoolean = (val) => {
	if (val == true) {
		return "Yes";
	} else {
		return "No";
	}
};

export const convertCoinType = (val) => {
	if (val == 1) {
		return "Debit";
	} else {
		return "Credit";
	}
};

export const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0;
};

export const convertObjToString = (items) => {
	let data = "";

	for (const key in items) {
		const item = items[key];
		if (typeof item === "object" && item !== null && "value" in item) {
			data += `${key}: ${item.value}, `;
		} else {
			data += `${key}: ${item}, `;
		}
	}

	return data.trim();
};

export const findNestedObj = (entireObj, keyToFind, valToFind) => {
	let foundObj;
	JSON.stringify(entireObj, (_, nestedValue) => {
		if (nestedValue && nestedValue[keyToFind] === valToFind) {
			foundObj = nestedValue;
		}
		return nestedValue;
	});
	return foundObj;
};

export const truncateText = (text, length) => {
	if (text.length > length) {
		return text.substring(0, length) + " ...";
	}
	return text;
};

export const calculateTotalPage = (total_items, per_page_total) => {
	return Math.ceil(total_items / per_page_total);
};

export const orderStatusTypeToText = (type) => {
	if (type == 1) {
		return "Pending";
	} else if (type == 2) {
		return "Processing";
	} else if (type == 3) {
		return "In transit";
	} else if (type == 4) {
		return "Delivered";
	} else if (type == 5) {
		return "Returned";
	} else {
		return "Cancelled";
	}
};

export const orderStatusColor = (type) => {
	if (type == 1) {
		return "primary";
	} else if (type == 2) {
		return "primary";
	} else if (type == 3) {
		return "primary";
	} else if (type == 4) {
		return "primary";
	} else if (type == 5) {
		return "red";
	} else {
		return "red";
	}
};
