// ADDED FOR CREATING IMAGE IN THE BACKEND - complete file

import { verifyAuthCookie } from '../Auth/authToken.js';
import fs from 'fs';
import path from 'path';

const UPLOADS_BASE = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

export default async function chartRoutes(fastify) {
// GET /api/charts/user-state-durations/:matchId
	fastify.get('/api/charts/user-state-durations/:matchId', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		const { matchId } = request.params;

		// Whitelist: only digits to avoid path traversal
		if (!/^\d+$/.test(String(matchId))) {
			return reply.code(400).send({ error: 'Invalid match id' });
		}

		const dir = path.join(UPLOADS_BASE, 'charts', String(matchId));
		const file = path.join(dir, `user_state_durations_match_${matchId}.svg`);

		if (!fs.existsSync(file)) {
			return reply.code(404).send({ error: 'Chart not found' });
		}

		reply.type('image/svg+xml');
		return fs.createReadStream(file);
	});

	fastify.get('/api/charts/bar_chart/:matchId', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		const { matchId } = request.params;

		// Whitelist: only digits to avoid path traversal
		if (!/^\d+$/.test(String(matchId))) {
			return reply.code(400).send({ error: 'Invalid match id' });
		}

		const dir = path.join(UPLOADS_BASE, 'charts', String(matchId));
		const file = path.join(dir, `bar_chart_${matchId}.svg`);

		if (!fs.existsSync(file)) {
			return reply.code(404).send({ error: 'Chart not found' });
		}

		reply.type('image/svg+xml');
		return fs.createReadStream(file);
	});
}