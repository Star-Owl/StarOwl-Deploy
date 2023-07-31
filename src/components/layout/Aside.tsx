import Input from '@ui/Input'
import { ChangeEvent, useEffect, useState } from 'react'
import RecommendationPanel from './RecommendationPanel'
import Twemoji from 'react-twemoji'
import { useRouter } from 'next/router'
import useCurrentUser from 'src/hooks/useCurrentUser'
import Footer from '@ui/Footer'
import { FillHome } from 'src/icons/Icons'
import { searchUsers } from 'src/utils/searchUsers'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
import { cx } from 'class-variance-authority'
import PanelItem from '@ui/PanelItem'

interface Props {
	userId?: string
}

interface User {
	id: string
	displayName: string
	username: string
}

const Aside: React.FC<Props> = ({ userId }) => {
	const { data: currentUser, isLoading } = useCurrentUser()

	const [users, setUsers] = useState<User[]>([])
	const [query, setQuery] = useState('')

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch('/api/users')
			const usersData: User[] = await res.json()
			setUsers(usersData)
		}

		fetchUsers()
	}, [])

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.stopPropagation()
		setQuery(event.target.value)
	}

	const filteredUsers = searchUsers(users, query)

	//console.log(filteredUsers)

	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		setIsOpen(!!query)
	}, [query])

	return (
		<aside
			className="
				col-span-2
				mr-6
				hidden
				lg:flex
				flex-col
				w-1/2
				xl:w-[375px]
				xl:col-span-3"
		>
			<div className="sticky top-10 flex flex-col gap-6">
				<div className="relative">
					<Input
						placeholder="Search roost for..."
						onChange={handleChange}
						value={query}
					/>
					{isOpen && (
						<div
							className={cx(
								'absolute left-0 top-[125%] z-100 radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
								'rounded-[1rem] shadow-2xl w-full overflow-hidden',
								'bg-color-primary-lighter py-6 gap-2 flex flex-col',
							)}
						>
							<div
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu"
							>
								<h2 className="px-6 font-bold text-xl mb-6">
									Search Results
								</h2>
								<ul>
									{typeof filteredUsers === 'string' ? (
										<li>{filteredUsers}</li>
									) : filteredUsers.length > 0 ? (
										filteredUsers.map(
											(user: User, i: number) => (
												<li
													key={`user-${i}`}
													role="menuitem"
												>
													<PanelItem
														key={user.username}
														userId={user.username}
														size="micro"
													/>
													{/* {user.displayName} */}
												</li>
											),
										)
									) : (
										<li className="px-6 text-color-text-disabled leading-6">
											No starlings found in the cosmos.
											<br />
											Try a different Name or Username
										</li>
									)}
								</ul>
							</div>
						</div>
					)}
				</div>

				{/* <Search /> */}
				{/* <Twemoji options={{ className: 'emoji' }}>
									<Panel title="Whooo~ to follow🪶" href="/">
										<PanelItemTrends
											title="Next JS"
											category="Development"
											stat="57.5K"
										/>
										<PanelItemTrends
											title="Figma"
											category="Design"
											stat="107.5K"
										/>
										<PanelItemTrends
											title="Webflow"
											category="Design"
											stat="127.5K"
										/>
										<PanelItemTrends
											title="Tailwind CSS"
											category="Development"
											stat="87.5K"
										/>
										<PanelItemTrends
											title="Vercel"
											category="Development"
											stat="27.5K"
										/>
									</Panel>
								</Twemoji> */}
				{currentUser && (
					<Twemoji options={{ className: 'emoji' }}>
						<RecommendationPanel userId={currentUser.id} />
					</Twemoji>
				)}

				<Footer />
				{/* <div className="flex items-center">
							<Logo size={40} color="white" />
							<Twemoji options={{ className: 'emoji' }}>
								<div className="gap-x-[2px] flex flex-wrap items-center">
									{`\u00A9 ♠️♦️ Poker Cats Creations ♣️♥️ ${currentYear}`}
								</div>
							</Twemoji>
							<Logo size={40} color="white" />
						</div> */}
			</div>
		</aside>
	)
}

export default Aside
