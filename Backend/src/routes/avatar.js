import { verifyAuthCookie } from '../Auth/authToken.js';
import fs from 'fs';
import path from 'path';

export default async function avatarRoutes(fastify) {
	fastify.post('/api/upload-avatar', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		try {
			const data = await request.file(); // get the uploaded file
			if (!data) {
				reply.code(400).send({ error: 'No file uploaded' });
				return;
			}

			// Validate MIME type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (!allowedTypes.includes(data.mimetype)) {
				return reply.code(400).send({ error: 'Unsupported file type' });
			}

			// Extract file extension
			const ext = path.extname(data.filename) || '.png';


			const uploadDir = path.join(process.cwd(), 'uploads', 'avatars', String(request.user.userId));
			console.log('Upload directory:', uploadDir);
			if (fs.existsSync(uploadDir))
				fs.rmSync(uploadDir, { recursive: true, force: true });
			fs.mkdirSync(uploadDir, { recursive: true });

			const filePath = path.join(uploadDir, `avatar${ext}`);
			console.log('File path:', filePath);
			const writeStream = fs.createWriteStream(filePath);
			data.file.pipe(writeStream);

			// Wait for the stream to finish
			await new Promise((resolve, reject) => {
				writeStream.on('finish', resolve);
				writeStream.on('error', reject);
			});

			reply.send({ success: true, message: 'Upload succeeded', });
		} catch (err) {
			fastify.log.error(err.response?.data || err.message);
			reply.code(500).send('Upload Server failed.');
		}
	});

	fastify.get('/api/avatar/:userId', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		const { userId } = request.params;
		const avatarDir = path.join(process.cwd(), 'uploads', 'avatars', String(userId));
		const exts = ['.png', '.jpg', '.jpeg', '.webp'];
		for (const ext of exts) {
			const filePath = path.join(avatarDir, `avatar${ext}`);
			if (fs.existsSync(filePath)) {
				reply.type(`image/${ext.replace('.', '')}`);
				return fs.createReadStream(filePath);
			}
		}
		reply.code(404).send({ error: 'Avatar not found' });
	});
}