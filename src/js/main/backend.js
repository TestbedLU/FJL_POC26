export const getBaseUrl = _ => {
	const urlParts = location.href.split('/');
	return urlParts.slice(-1)[0].length
		? urlParts.slice(0, -1).join('/') + '/'
		: urlParts.join('/');
};

export const getUrl = file => {
	return getBaseUrl() + file;
};

export const getObj = url => {
	return fetch(url, {
		method: 'GET',
		cache: 'no-cache',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	})
	.then(response => {
		if (response.ok) {
			return response.text();
		}

		throw new Error(`Network response for ${url} was not ok.`);
	});
};

export const getJSON = url  => {
	return fetch(url, {
		method: 'GET',
		cache: 'no-cache',
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}

		throw new Error(`Network response for ${url} was not ok.`);
	});
};

export const send = payload => {
	return fetch('./', {
		method: 'POST',
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify(payload)
	})
	.then(response => {
		if (response.ok) {
			return {result: 'ok'};
		}

		throw new Error(`Network response was not ok.`);
	});
};
