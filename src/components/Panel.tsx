import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
	title: string
	href: string
	children: ReactNode
}

const Panel = ({ title, href, children }: Props) => (
	<div className="bg-color-primary-lighter rounded-[1rem] py-6">
		<div className="flex flex-col">
			<h2 className="text-xl flex items-center justify-center font-bold leading-none mb-6 px-6">
				{title}
			</h2>
			{children}
		</div>
		{/* <div className="px-4 py-4">
			<Link className="text-sm" href={href}>
				Show more
			</Link>
		</div> */}
	</div>
)

export default Panel
