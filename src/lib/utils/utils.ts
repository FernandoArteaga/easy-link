export function concatClasses(...classes: string[]) {
	return classes.join(' ').trim();
}

export const randomInputID = () => Math.random().toString(36).substring(2);

export function isValidLink(link: string) {
	return isValidUrl(link) || isValidDomain(link) || isValidIp(link);
}

export function isValidUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export function isValidDomain(domain: string) {
	const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/;
	return domainRegex.test(domain);
}

export function isValidIp(ip: string) {
	const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
	return ipv4Regex.test(ip);
}
