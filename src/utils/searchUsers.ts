interface User {
	id: string
	displayName: string
	username: string
}

export function searchUsers(users: User[], query: string): User[] | string {
	if (!query.trim()) {
		return []
		// return users
	}

	const lowerCaseQuery = query.toLowerCase()

	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(lowerCaseQuery) ||
			user.displayName.toLowerCase().includes(lowerCaseQuery),
	)

	return filteredUsers.slice(0, 5)
}
