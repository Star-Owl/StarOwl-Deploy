import { z } from 'zod'

// Assuming isTextValid is in the same folder, if not adjust the path
import { isTextValid } from 'src/libs/isTextValid'

export const displayNameSchema = z
	.string()
	.min(1, 'Display Name must be at least 1 character long.')
	.max(50, 'Display Name is too long. It should have at most 50 characters.')
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
		(displayName) => displayName.trim().length > 0,
		"Display Name can't be only spaces.",
	)
