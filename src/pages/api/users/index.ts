import { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'src/libs/prismadb'
import serverAuth, { isUserAuthenticated } from 'src/libs/serverAuth'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const isAuthenticated = await isUserAuthenticated(req)

	if (!isAuthenticated) {
		res.statusCode = 401
		res.json({ message: 'Unauthorized' })
		return
	}

	if (req.method !== 'GET') {
		return res.status(405).end()
	}

	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		})

		return res.status(200).json(users)
	} catch (error) {
		console.log(error)
		return res.status(400).end()
	}
}
