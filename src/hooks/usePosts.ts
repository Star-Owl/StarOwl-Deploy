import useSWRInfinite from 'swr/infinite'
import fetcher from 'src/libs/fetcher'

const PAGE_SIZE = 7

const getKey = (
	pageIndex: number,
	previousPageData: any[] | null,
	userId?: string,
) => {
	if (previousPageData && previousPageData.length < PAGE_SIZE) return null

	const params = new URLSearchParams()
	params.set('_limit', String(PAGE_SIZE))
	params.set('_start', String(pageIndex * PAGE_SIZE))
	if (userId) params.set('userId', userId)

	return `/api/posts?${params}`
}

const usePosts = (userId?: string) => {
	const { data, error, size, setSize, mutate } = useSWRInfinite<any[]>(
		(pageIndex, previousPageData) =>
			getKey(pageIndex, previousPageData, userId),
		fetcher,
	)

	console.log(data)

	const posts = data ? data.flat() : []
	const isLoadingInitialData = !data && !error
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === 'undefined')

	return {
		posts,
		isLoadingMore,
		isLoadingInitialData,
		size,
		setSize,
		isEmpty: data?.[0]?.length === 0,
		isReachingEnd: data && data[data.length - 1]?.length < PAGE_SIZE,
		mutate,
	}
}

export default usePosts
