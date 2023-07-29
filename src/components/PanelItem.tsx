import Avatar from '@rd/Avatar'
import Button from '@ui/Button'
import UserPanel from './user/UserPanel'
import { useRouter } from 'next/router'
import useUser from 'src/hooks/useUser'
import useCurrentUser from 'src/hooks/useCurrentUser'
import useEditModal from 'src/hooks/useEditModal'
import useFollow from 'src/hooks/useFollow'
import React from 'react'

interface Props {
	userId?: string
}

const PanelItem = ({ userId }: Props) => {
	const router = useRouter()

	const { data: currentUser } = useCurrentUser()
	const { data: fetchedUser, isLoading } = useUser(userId as string)

	const editModal = useEditModal()

	const { isFollowing, toggleFollow } = useFollow(userId as string)

	const [isHovered, setIsHovered] = React.useState(false)

	return (
		<div className="flex flex-1 items-center px-6 py-6 hover:bg-color-text-dead">
			<div className="flex items-center gap-x-6 flex-1">
				<UserPanel type="small" userId={fetchedUser?.username} />
			</div>
			<div className="">
				<Button
					//onMouseEnter={() => setIsHovered(true)}
					//onMouseLeave={() => setIsHovered(false)}
					onClick={toggleFollow}
					size="micro"
					intent={
						isHovered && isFollowing
							? 'danger'
							: isFollowing
							? 'secondary'
							: 'outline'
					}
					label={
						isHovered && isFollowing
							? 'Unfollow'
							: isFollowing
							? 'Following'
							: 'Follow'
					}
					isFollowing={!isFollowing}
				/>
			</div>
		</div>
	)
}

export default PanelItem
