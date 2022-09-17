export default async function UseFetch(name, data) {
	const fullUrl = "https://modelapi.letsusedata.com/api/" + name;

	data.StudentHash = localStorage.getItem("Hash");
	data.Hash = localStorage.getItem("Hash");
	data.StudentId = localStorage.getItem("Hash");

	const parameter = {
		headers: { "content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify(data),
		method: "post",
	};
	const res = await fetch(fullUrl, parameter);
	return await res.json();
}
