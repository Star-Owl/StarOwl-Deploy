import { useState, useEffect } from 'react'
import axios from 'axios'
import PanelItem from '@ui/PanelItem'
import Twemoji from 'react-twemoji'
import Panel from '@ui/Panel'

interface User {
	id: string
	username: string
	email: string
}

interface RecommendationPanelProps {
	userId?: string
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
	userId,
}) => {
	const [recommendedUsers, setRecommendedUsers] = useState<User[]>([])

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get(
					`/api/getNotFollowing?userId=${userId}`,
				)
				setRecommendedUsers(res.data)
			} catch (error) {
				console.error(error)
			}
		}

		fetchRecommendations()
	}, [userId, recommendedUsers])

	return (
		<Twemoji options={{ className: 'emoji' }}>
			<Panel title="Whooo~ to follow 🪶" href="/">
				{recommendedUsers.map((user: User) => (
					<PanelItem key={user.username} userId={user.username} />
				))}
			</Panel>
		</Twemoji>
	)
}

export default RecommendationPanel
