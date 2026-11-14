export const EMPTY_CODE_MESSAGES = {
	share: {
		title: "Empty Code",
		description: "The code is empty, nothing to share.",
		duration: 2000,
	},
	copy: {
		title: "Empty Code",
		description: "The code is empty, nothing to copy.",
		duration: 2000,
	},
	download: {
		title: "Empty Code",
		description: "The code is empty, nothing to download.",
		duration: 2000,
	},
	run: {
		title: "Empty Code",
		description: "The code is empty, nothing to run.",
		duration: 2000,
	},
};

export const CODE_ACTIONS = {
	copySuccess: {
		title: "Code copied!",
		description: "The code has been copied to your clipboard.",
		duration: 2000,
	},
	downloadSuccess: {
		title: "Code downloaded!",
		description: "The code has been downloaded as 'code.js'",
		duration: 2000,
	},
	downloadError: {
		title: "Download failed",
		description: "The code could not be downloaded.",
		duration: 2000,
	},
};

export const LINK_MESSAGES = {
	createError: {
		title: "Error creating link",
		description: "The link could not be created.",
		duration: 2000,
	},
};

export function getLinkCreatedMessage(shortUrl: string) {
	return {
		title: "Link Created",
		description: `The ${shortUrl}... has been copied to your clipboard.`,
		duration: 2000,
	};
}

export function getDownloadMessage(path: string) {
	return {
		title: "Code downloaded!",
		description: `The code has been downloaded to '${path}'`,
		duration: 2000,
	};
}
