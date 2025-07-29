


export default async function uploadAvatarRoute(fastify) {
	fastify.post('/api/upload-avatar', async (request, reply) => {
		try {
			const File = request.avatar;
			// upload by multer?
			reply.send("Upload successed (NOT IMPLEMENTED YET");
		} catch (err) {
			fastify.log.error(err.response?.data || err.message);
			reply.code(500).send('Upload Server failed.');
		}
	})
}