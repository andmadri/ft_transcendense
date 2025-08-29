import crypto from 'crypto';

const ENC_ALGO = 'aes-256-gcm';

/**
 * Encrypts a secret using AES-256-GCM algorithm.
 * The encryption key is derived from an environment variable.
 *
 * @param {string} secret - The secret to encrypt.
 * @returns {Object} - An object containing the initialization vector, encrypted content, and authentication tag.
 */
export function encryptSecret(secret) {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(ENC_ALGO, Buffer.from(process.env.ENC_2FA_SECRET, 'base64'), iv);

	const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();

	return {
		iv: iv.toString('base64'),
		content: encrypted.toString('base64'),
		tag: authTag.toString('base64')
	};
}

/** * Decrypts an encrypted secret using AES-256-GCM algorithm.
 * The decryption key is derived from an environment variable.
 *
 * @param {Object} encryptedData - An object containing the initialization vector, encrypted content, and authentication tag.
 * @returns {string} - The decrypted secret.
 */
export function decryptSecret(encryptedData) {
	const decipher = crypto.createDecipheriv(
		ENC_ALGO,
		Buffer.from(process.env.ENC_2FA_SECRET, 'base64'),
		Buffer.from(encryptedData.iv, 'base64')
	);

	decipher.setAuthTag(Buffer.from(encryptedData.tag, 'base64'));

	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(encryptedData.content, 'base64')),
		decipher.final()
	]);

	return decrypted.toString('utf8');
}
