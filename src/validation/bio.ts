import { z } from 'zod'
import { isTextValid } from 'src/libs/isTextValid'

// User Roles Enum
const UserRole = {
	USER: 'user',
	STAR: 'starUser',
}

// Schemas
const BioCreateSchemaForNormalUser = z
	.string()
	.max(250, "Bio can't exceed 250 characters.")
	.transform((value) => value.trim())
	.refine(
		(value) => value.length > 0,
		"Bio can't be empty or contain only spaces.",
	)
	.refine(
		(value) => {
			const { valid } = isTextValid(value)
			return valid
		},
		(value) => ({
			message: `Bio ${isTextValid(value).message}`,
		}),
	)
const BioCreateSchemaForStarUser = z
	.string()
	.max(500, "Bio can't exceed 500 characters.")
	.transform((value) => value.trim())
	.refine(
		(value) => value.length > 0,
		"Bio can't be empty or contain only spaces.",
	)
	.refine(
		(value) => {
			const { valid } = isTextValid(value)
			return valid
		},
		(value) => ({
			message: `Bio ${isTextValid(value).message}`,
		}),
	)

export const getMaxBioLength = (userRole: string) => {
	switch (userRole) {
		case UserRole.STAR:
			return 500
		case UserRole.USER:
		default:
			return 250
	}
}

export const bioSchema = (userRole: string) => {
	let schema

	switch (userRole) {
		case UserRole.STAR:
			schema = BioCreateSchemaForStarUser
			break
		case UserRole.USER:
		default:
			schema = BioCreateSchemaForNormalUser
			break
	}

	return schema
}
