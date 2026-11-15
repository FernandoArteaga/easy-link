export function concatClasses(...classes: string[]) {
	return classes.join(' ').trim()
}

export const randomInputID = () => Math.random().toString(36).substring(2)

/** A full URL, or a schemeless one whose host is a domain or IP ("github.com/a/b") */
export function isValidLink(link: string) {
	if (isValidUrl(link)) return true
	if (/\s/.test(link)) return false
	const split = link.search(/[/?#]/)
	const head = split === -1 ? link : link.slice(0, split)
	return isValidDomain(head) || isValidIp(head)
}

export function isValidUrl(url: string) {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export function isValidDomain(domain: string) {
	const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/
	return domainRegex.test(domain)
}

export function isValidIp(ip: string) {
	const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
	return ipv4Regex.test(ip)
}

/**
 * Lower-cases only the case-insensitive parts of a link (scheme and host), keeping the path,
 * query and hash as typed. Text that isn't a recognisable link is returned unchanged.
 */
export function normalizeLink(link: string): string {
	const withScheme = /^([a-z][a-z\d+.-]*:\/\/)([^/?#]*)(.*)$/is.exec(link)
	if (withScheme) {
		const [, scheme, authority, rest] = withScheme
		// Keep any user:password@ as typed; only the host (and port) is case-insensitive
		const at = authority.lastIndexOf('@') + 1
		return scheme.toLowerCase() + authority.slice(0, at) + authority.slice(at).toLowerCase() + rest
	}
	const split = link.search(/[/?#]/)
	const head = split === -1 ? link : link.slice(0, split)
	if (!isValidDomain(head) && !isValidIp(head)) return link
	return head.toLowerCase() + link.slice(head.length)
}

/**
 * Splits a saved link for display: `domain` (host without `www.`), `path` (everything after the host)
 * and `display` (the link without scheme and `www.`). Text that isn't a link is all `domain`.
 */
export function splitLink(link: string): { domain: string; path: string; display: string } {
	const display = link.replace(/^[a-z][a-z\d+.-]*:\/\//i, '').replace(/^www\./i, '')
	const split = display.search(/[/?#]/)
	if (split === -1) return { domain: display, path: '', display }
	const head = display.slice(0, split)
	if (!isValidUrl(link) && !isValidDomain(head) && !isValidIp(head)) {
		return { domain: display, path: '', display }
	}
	return { domain: head, path: display.slice(split), display }
}
