import { useState, useCallback, useEffect, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { z, ZodError } from 'zod'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useModalContext } from 'src/contexts/ModalContext'
import Button from '@ui/Button'
import Input from '@ui/Input'
import { Close, OutlineEye, OutlineEyeOff } from 'src/icons/Icons'
import useCurrentUser from 'src/hooks/useCurrentUser'
import useUser from 'src/hooks/useUser'

import {
	displayNameSchema,
	usernameSchema,
	bioSchema,
} from 'src/validation/validationSchemas'
import { validateInput } from 'src/validation/validateInput'
import axios from 'axios'
import router from 'next/router'
import { formatNumber } from 'src/libs/formatNumber'
import { getMaxBioLength } from 'src/validation/bio'

function EditModal() {
	const { isEditModalVisible, setEditModalVisible } = useModalContext()

	const [isDialogVisible, setIsDialogVisible] = useState(false)
	const [editedContent, setEditedContent] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleClick = useCallback(() => {
		setIsDialogVisible(true)
	}, [])

	//set data to send

	const { data: currentUser } = useCurrentUser()
	const { mutate: mutateFetchedUser } = useUser(currentUser?.id)

	const [profileImage, setProfileImage] = useState('')
	const [coverImage, setCoverImage] = useState('')
	const [displayName, setDisplayName] = useState('')
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')

	const maxBioLength = getMaxBioLength(currentUser?.role)

	const [dataLoaded, setDataLoaded] = useState(false)

	useEffect(() => {
		setProfileImage(currentUser?.profileImage)
		setCoverImage(currentUser?.coverImage)
		setDisplayName(currentUser?.displayName)
		setUsername(currentUser?.username)
		setBio(currentUser?.bio)
	}, [
		currentUser?.displayName,
		currentUser?.username,
		currentUser?.bio,
		currentUser?.profileImage,
		currentUser?.coverImage,
	])

	const [charCount, setCharCount] = useState(0)

	const validateAndSetBio = (bioText: string) => {
		let additionalChars = 0
		const lines = bioText.split('\n')
		for (let i = 0; i < lines.length - 1; i++) {
			if (/^\s*?.$/.test(lines[i])) {
				additionalChars += 50
			}
		}

		const charCount = bioText.length + additionalChars
		setCharCount(charCount)

		// Validate the new bio
		// try {
		// 	validateInput(bio, bioSchema(currentUser?.role))
		// 	// If the validation is successful, we can continue.
		// 	// Otherwise, an error will be thrown.
		// } catch (error) {
		// 	// Handle the validation error
		// 	console.error(error)
		// }
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		let postText = e.target.value
		postText = postText.replace(/[ ]{2,}/g, ' ')
		setBio(postText)

		validateAndSetBio(postText)
	}

	useEffect(() => {
		if (isDialogVisible) {
			validateAndSetBio(bio)
		}
	}, [isDialogVisible, bio])

	useEffect(() => {
		if (bio && isDialogVisible && textareaRef.current) {
			const lineHeight = 20
			const padding = 20
			const maxRows = 5 // Define max rows

			const textAreaLineHeight = lineHeight
			textareaRef.current.rows = 2

			const newRows = ~~(
				(textareaRef.current.scrollHeight - padding) /
				textAreaLineHeight
			)

			if (newRows === 0) {
				textareaRef.current.rows = 2
			} else if (newRows > maxRows) {
				textareaRef.current.rows = maxRows
			} else {
				textareaRef.current.rows = newRows
			}

			// If the new rows count is less than the previous count
			// set scrollTop to 0. This is needed to avoid jumping in some browsers.
			if (newRows < textareaRef.current.rows) {
				textareaRef.current.scrollTop = 0
			}
		}
	}, [bio, isDialogVisible])

	// const validateDisplayName = async (displayName: string) => {
	// 	return validateInput(displayName, displayNameSchema)
	// }

	// const validateDisplayName = async (data: string) => {
	// 	return validateInput(displayName, displayNameSchema)
	// }
	// const validateUsername = async (data: string) => {
	// 	return validateInput(data, displayNameSchema)
	// }

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

			const validationResults = await Promise.allSettled([
				validateInput(displayName, displayNameSchema),
				validateInput(username, usernameSchema),
				validateInput(bio, bioSchema(currentUser?.role)),
			])

			console.log(validationResults)

			const errors = validationResults
				.filter((result) => result.status === 'rejected')
				.map((result) => (result as PromiseRejectedResult).reason)

			if (errors.length > 0) {
				errors.forEach((err) => {
					if (typeof err === 'string') {
						toast.error(err, {
							position: 'bottom-right',
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: false,
							pauseOnHover: false,
							draggable: false,
							progress: undefined,
							theme: 'dark',
						})
					} else if (err instanceof Error) {
						const errorMessages = JSON.parse(err.message)
						errorMessages.forEach((message: string) =>
							toast.error(message, {
								position: 'bottom-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: false,
								pauseOnHover: false,
								draggable: false,
								progress: undefined,
								theme: 'dark',
							}),
						)
					}
				})
				return
			}

			await axios.patch('/api/edit', {
				displayName,
				username,
				bio,
				profileImage,
				coverImage,
			})

			toast.success('Profile successfully edited.', {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false,
				progress: undefined,
				theme: 'dark',
			})

			mutateFetchedUser()
			// If username has changed, navigate to new profile page
			if (username !== currentUser.username) {
				router.push(`/${username}`)
				setIsDialogVisible(false)
			} else {
				// If username has not changed, refresh the profile and close the modal
				router.reload()
				setIsDialogVisible(false)
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const serverError = error
				// Handle the error here. For example:
				const errorMessage =
					serverError?.response?.data?.message ||
					'Something went wrong.'
				toast.error(errorMessage, {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: false,
					pauseOnHover: false,
					draggable: false,
					progress: undefined,
					theme: 'dark',
				})
			} else {
				// Something happened in setting up the request that triggered an Error
				toast.error('Something went wrong.', {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: false,
					pauseOnHover: false,
					draggable: false,
					progress: undefined,
					theme: 'dark',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}, [
		displayName,
		username,
		bio,
		mutateFetchedUser,
		profileImage,
		coverImage,
		router,
	])

	return (
		<DialogPrimitive.Root
			open={isEditModalVisible}
			onOpenChange={setEditModalVisible}
		>
			<DialogPrimitive.Trigger asChild>
				<div className="flex justify-center xl:justify-start appearance-none">
					<Button
						intent="outline"
						size="small"
						label="Edit"
						onClick={() => handleClick()}
					/>
				</div>
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="DialogOverlay bg-slate-900/60 backdrop-blur-[12px] fixed inset-0 z-30" />
				<DialogPrimitive.Content className="DialogContent bg-color-primary-dark px-6 pt-6 pb-6 -translate-x-2/4 -translate-y-2/4 rounded-2xl shadow-xl fixed z-40 top-1/2 left-1/2 w-[90vw] max-w-xl max-h-[85vh] focus:outline-none">
					<div className="flex items-center justify-between w-full mb-12">
						<DialogPrimitive.Title className="text-xl">
							Edit
						</DialogPrimitive.Title>
						<DialogPrimitive.Close asChild>
							<button
								className="hover:bg-color-text-subtle rounded-[.5rem] h-10 w-10 flex justify-center items-center"
								aria-label="Close"
							>
								<Close className="h-6" />
							</button>
						</DialogPrimitive.Close>
					</div>
					<div className="flex flex-col gap-4">
						<Input
							placeholder="Display Name"
							onChange={(e) => setDisplayName(e.target.value)}
							value={displayName}
							disabled={isLoading}
						/>
						<Input
							placeholder="Username"
							onChange={(e) => setUsername(e.target.value)}
							value={username}
							disabled={isLoading}
						/>
						<textarea
							ref={textareaRef}
							value={bio}
							disabled={isLoading}
							onChange={handleInputChange}
							placeholder="Bio"
							className="
								leading-normal
								w-full
								px-4
								py-4
								rounded-[1rem]
								text-xl
								bg-color-primary-lighter
								border-transparent
								placeholder:text-slate-600
								outline-0
								focus:outline-none
								appearance-none
								focus:ring-0
								focus:border-transparent
								resize-none
								disabled:opacity-50
                    			disabled:cursor-not-allowed"
						/>
						<span
							className={`text-color-text-disabled ${
								charCount > maxBioLength
									? '!text-color-danger'
									: ''
							}`}
						>
							{formatNumber(charCount)} / {maxBioLength}
						</span>
						{/* <Input
							placeholder="Bio"
							onChange={(e) => setBio(e.target.value)}
							value={bio}
							disabled={isLoading}
						/> */}
						<div className="flex gap-6 mt-6">
							{/* <Button
								intent="outline"
								label="Reset"
								size="large"
								fullWidth
								onClick={onReset}
							/> */}
							<Button
								intent="primary"
								label="Save"
								size="large"
								fullWidth
								onClick={onSubmit}
							/>
						</div>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	)
}

export default EditModal
