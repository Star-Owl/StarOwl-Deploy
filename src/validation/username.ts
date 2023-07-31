import { z } from 'zod'

// Assuming isTextValid is in the same folder, if not adjust the path
import { isTextValid } from 'src/libs/isTextValid'

export const usernameSchema = z
	.string()
	.min(4, 'Username must be at least 4 characters long.')
	.max(15, 'Username is too long. It should have at most 15 characters.')
	.refine(
		(displayName) => {
			const { valid } = isTextValid(displayName)
			return valid
		},
		(displayName) => ({
			message: `Display Name ${isTextValid(displayName).message}`,
		}),
	)
	.refine(
		(username) => /^[A-Za-z][A-Za-z0-9_]*$/.test(username),
		"Username can only contain alphanumeric characters and underscores, and can't start with a number.",
	)
	.refine(
		(username) => !/^\d+$/.test(username),
		"Username can't be only numbers.",
	)
