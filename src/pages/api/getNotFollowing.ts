// api/getNotFollowing.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'src/libs/prismadb'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		return res.status(405).end()
	}

	let userId = req.query.userId

	// Upewnij się, że userId jest stringiem
	if (Array.isArray(userId)) {
		userId = userId[0]
	}

	if (typeof userId !== 'string') {
		return res.status(400).json({ error: 'Invalid user id' })
	}

	try {
		const followings = await prisma.follower.findMany({
			where: {
				userId: userId,
			},
		})
		const followingIds = followings.map((f) => f.followerId)
		followingIds.push(userId) // dodajemy id użytkownika, aby nie zwracać go w wynikach

		const users = await prisma.user.findMany({
			where: {
				id: {
					notIn: followingIds,
				},
			},
			take: 3,
			orderBy: {
				id: 'desc',
			},
		})

		return res.status(200).json(users)
	} catch (error) {
		console.log(error)
		return res.status(400).end()
	}
}
