import Head from 'next/head'
import Nav from '@ui/Nav'
import Header from '@ui/Header'
import Footer from '@ui/Footer'
import Tabs from '@rd/Tabs'
import Input from '@ui/Input'

import { ChangeEvent, useEffect, useState } from 'react'
//import Feed from '@ui/Feed'
import Form from '@ui/Form'
import { useRouter } from 'next/router'
import useCurrentUser from 'src/hooks/useCurrentUser'
import SplashScreen from './loading'
import { GetStaticProps } from 'next'

import PostFeed from '@ui/posts/PostFeed'
import PanelItemTrends from '@ui/PanelItemTrends'
import Twemoji from 'react-twemoji'
import Panel from '@ui/Panel'
import PanelItem from '@ui/PanelItem'
import RecommendationPanel from '@ui/layout/RecommendationPanel'
import Aside from '@ui/layout/Aside'

export default function Home() {
	const router = useRouter()
	const { userId } = router.query
	const { data: currentUser, isLoading } = useCurrentUser()

	const [isPageLoaded, setPageLoaded] = useState(true)

	useEffect(() => {
		if (!isLoading) {
			setPageLoaded(false)
		}
	}, [isLoading])

	if (isPageLoaded) {
		return <SplashScreen />
	}

	const followedUsersIds =
		currentUser?.Following?.map((follower: any) => follower.followerId) ||
		[]
	const userIdsToShowPosts = [currentUser?.username, ...followedUsersIds]

	return (
		<>
			{isPageLoaded && <SplashScreen />}
			{!isPageLoaded && (
				<>
					<Head>
						<title>StarOwl | Home</title>
						<meta
							name="description"
							content="Generated by create next app"
						/>
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<div
						className="
							min-h-screen
							flex
							md:mx-auto
							gap-6
							md:px-0
							grid-cols-12
							xl:max-w-screen-2xl
							xl:grid
							lg:gap-12"
					>
						<Nav />
						<main
							className="
								mb-10
								w-full
								col-span-6
								md:pr-6
								lg:pr-0
								xl:col-span-5
								flex
								flex-col
								gap-6"
						>
							<Header title="Nest" />
							<Form
								width="default"
								placeholder={
									"What's illuminating your world today?"
								}
							/>
							{/* <Tabs /> */}
							<PostFeed />
						</main>
						<Aside />
					</div>
				</>
			)}
		</>
	)
}
