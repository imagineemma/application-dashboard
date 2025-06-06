import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const authenticateGoogle = async (googleApiCredential: string) => {
	const auth = new google.auth.GoogleAuth({
		credentials: JSON.parse(googleApiCredential),
		scopes: [
			"https://www.googleapis.com/auth/documents",
			"https://www.googleapis.com/auth/drive",
		],
	});

	const authClient = (await auth.getClient()) as OAuth2Client;
	return authClient;
};

export const createGoogleClients = async (googleApiCredential: string) => {
	const auth = await authenticateGoogle(googleApiCredential);

	return {
		googleDocs: google.docs({
			version: "v1",
			auth,
		}),
		googleDrive: google.drive({
			version: "v3",
			auth,
		}),
	};
};
