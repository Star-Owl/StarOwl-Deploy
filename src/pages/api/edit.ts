import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from 'src/libs/serverAuth'
import prisma from 'src/libs/prismadb'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'PATCH') {
		return res.status(405).end()
	}

	try {
		const { currentUser } = await serverAuth(req, res)

		const { displayName, username, bio, profileImage, coverImage } =
			req.body

		if (!displayName || !username) {
			throw new Error('Missing fields')
		}

		// Check if the username is already taken by another user
		const existingUser = await prisma.user.findUnique({
			where: {
				username,
			},
		})

		if (existingUser && existingUser.id !== currentUser.id) {
			return res
				.status(400)
				.json({ message: 'Username is already taken' })
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				displayName,
				username,
				bio,
				profileImage,
				coverImage,
			},
		})

		return res.status(200).json(updatedUser)
	} catch (error) {
		console.log(error)
		return res.status(400).end()
	}
}
