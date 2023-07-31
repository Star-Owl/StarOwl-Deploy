import Avatar from '@rd/Avatar'
import Button from '@ui/Button'
import UserPanel from './user/UserPanel'
import { useRouter } from 'next/router'
import useUser from 'src/hooks/useUser'
import useCurrentUser from 'src/hooks/useCurrentUser'
import useEditModal from 'src/hooks/useEditModal'
import useFollow from 'src/hooks/useFollow'
import React, { useCallback } from 'react'

interface Props {
	userId?: string
	size?: 'icon' | 'micro' | 'small' | 'default' | 'large'
	content?: boolean
}

const PanelItem = ({ userId, size = 'small', content = false }: Props) => {
	const router = useRouter()

	const { data: currentUser } = useCurrentUser()
	const { data: fetchedUser, isLoading } = useUser(userId as string)

	const editModal = useEditModal()

	const { isFollowing, toggleFollow } = useFollow(userId as string)

	const [isHovered, setIsHovered] = React.useState(false)

	const goToUser = useCallback(
		(ev: any) => {
			ev.stopPropagation()
			if (ev.target.tagName !== 'BUTTON') {
				router.push(`/${fetchedUser?.username}`)
			}
		},
		[router, fetchedUser?.username],
	)

	return (
		<div
			className="flex flex-1 items-center px-6 py-4 hover:bg-color-text-dead hover:cursor-pointer"
			onClick={goToUser}
		>
			<div className="flex items-center gap-x-6 flex-1">
				<UserPanel type="small" userId={fetchedUser?.username} />
			</div>
			{/* <a href={`/${fetchedUser?.username}`}>
				<div className="flex items-center gap-x-6 flex-1">
					<UserPanel type="small" userId={fetchedUser?.username} />
				</div>
			</a> */}
			{content &&
				(currentUser?.username === userId ? (
					<Button
						intent="outline"
						size={size}
						label="Edit"
						disabled
						onClick={editModal.onOpen}
					/>
				) : (
					<Button
						//onMouseEnter={() => setIsHovered(true)}
						//onMouseLeave={() => setIsHovered(false)}
						onClick={toggleFollow}
						size={size}
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
				))}
		</div>
	)
}

export default PanelItem
