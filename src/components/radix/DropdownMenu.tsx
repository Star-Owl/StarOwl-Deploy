import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import cx from 'classnames'
import { ReactNode, useCallback } from 'react'
import NavItem from '@ui/NavItem'

import {
	HiOutlineEllipsisHorizontal,
	HiOutlineFaceFrown,
	HiOutlineUserPlus,
	HiOutlineQueueList,
	HiOutlineSpeakerXMark,
	HiOutlineNoSymbol,
	HiCodeBracket,
	HiOutlineFlag,
} from 'react-icons/hi2'

import {
	OutlineEdit,
	OutlineTrashCan,
	OutlineMessage,
	OutlinePin,
	Views,
	Share,
	OutlineMore,
} from 'src/icons/Icons'
import Button from '@ui/Button'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
import useCurrentUser from 'src/hooks/useCurrentUser'
import useUser from 'src/hooks/useUser'

interface AccordionItem {
	href: string
	text: string
	width: 'full' | 'inline' | 'mobile'
	size: 'small' | 'default' | 'large'
	icon?: ReactNode
	disabled?: boolean
}

interface Props {
	userId?: string
}

const DropdownMenuDemo: React.FC<Props> = ({ userId }) => {
	const { data: currentUser } = useCurrentUser()
	const { data: fetchedUser } = useUser(userId as string)

	const myPost: AccordionItem[] = [
		{
			href: '/',
			text: 'Edit Hoot (soon)',
			width: 'full',
			size: 'small',
			icon: <OutlineEdit className="w-6" />,
		},
		{
			href: '/',
			text: 'Delete Hoot (soon)',
			width: 'full',
			size: 'small',
			icon: <OutlineTrashCan className="w-6" />,
		},
		{
			href: '/',
			text: 'Change who can reply (soon)',
			width: 'full',
			size: 'small',
			icon: <OutlineMessage className="w-6" />,
		},
		{
			href: '/',
			text: 'Pin to your profile (soon)',
			width: 'full',
			size: 'small',
			icon: <OutlinePin className="w-6" />,
		},
		{
			href: '/',
			text: 'View Hoot analitics (soon)',
			width: 'full',
			size: 'small',
			icon: <Views className="w-6" />,
		},
	]

	const post: AccordionItem[] = [
		{
			href: '/',
			text: "This Hoot's not helpful (soon)",
			width: 'full',
			size: 'small',
			icon: <HiOutlineFaceFrown className="w-6 h-6" />,
		},
		{
			href: '/',
			text: `Follow @${
				fetchedUser ? fetchedUser.username : 'unknown'
			} (soon)`,
			width: 'full',
			size: 'small',
			icon: <HiOutlineUserPlus className="w-6 h-6" />,
		},
		{
			href: '/',
			text: `Mute @${
				fetchedUser ? fetchedUser.username : 'unknown'
			} (soon)`,
			width: 'full',
			size: 'small',
			icon: <HiOutlineSpeakerXMark className="w-6 h-6" />,
		},
		{
			href: '/',
			text: `Block @${
				fetchedUser ? fetchedUser.username : 'unknown'
			} (soon)`,
			width: 'full',
			size: 'small',
			icon: <HiOutlineNoSymbol className="w-6 h-6" />,
		},
		{
			href: '/',
			text: 'Embed Hoot (soon)',
			width: 'full',
			size: 'small',
			icon: <HiCodeBracket className="w-6 h-6" />,
		},
		{
			href: '/',
			text: 'Report Hoot (soon)',
			width: 'full',
			size: 'small',
			icon: <HiOutlineFlag className="w-6 h-6" />,
		},
	]

	const displayedPosts = currentUser?.id === fetchedUser?.id ? myPost : post

	return (
		<DropdownMenuPrimitive.Root>
			<DropdownMenuTrigger>
				<Button
					intent="icon"
					size="icon"
					aria-label="Customize options"
				>
					<OutlineMore className="w-6" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					sideOffset={0}
					alignOffset={0}
					align="end"
					className={cx(
						'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
						'rounded-[1rem] shadow-2xl w-fit overflow-hidden',
						'bg-color-primary-dark py-4 px-4 gap-2 flex flex-col',
					)}
				>
					{displayedPosts.map(({ href, text, icon }, i) => (
						<DropdownMenuPrimitive.Item
							key={`header-${i}`}
							className="focus:outline-none overflow-hidden"
						>
							<NavItem
								href={href}
								width={'full'}
								size={'drowDown'}
							>
								{icon}
								<div className="inline-flex flex-none text-lg">
									{text}
								</div>
							</NavItem>
						</DropdownMenuPrimitive.Item>
					))}
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	)
}

export default DropdownMenuDemo
