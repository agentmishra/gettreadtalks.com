import React from 'react'
import firebase from 'gatsby-plugin-firebase'
import { navigate } from 'gatsby'

import { useAsync } from 'hooks/async'
import { FullPageLogo, FullPageErrorFallback } from 'components/loader'

const AuthContext = React.createContext({})
AuthContext.displayName = 'AuthContext'

function useAuth() {
	const context = React.useContext(AuthContext)
	if (context === undefined) {
		throw new Error(`useAuth must be used within a AuthProvider`)
	}
	return context
}

function AuthProvider(props) {
	const auth = firebase.auth()
	const db = firebase.firestore()

	const {
		data: profile,
		status,
		error,
		setData,
		isLoading,
		isIdle,
		isError,
		isSuccess,
	} = useAsync()

	React.useEffect(
		() => auth.onAuthStateChanged((creds) => setData(creds)),
		[auth, setData]
	)

	const updateUsersCollection = React.useCallback(
		(id, updates, args) =>
			db
				.collection('users')
				.doc(id)
				.set(updates, args || { merge: true }),
		[db]
	)

	const login = React.useCallback(
		(form) =>
			auth
				.signInWithEmailAndPassword(form.email, form.password)
				.then((creds) => setData(creds))
				.then(() => navigate('/account')),
		[auth, setData]
	)

	const register = React.useCallback(
		(form) =>
			auth
				.createUserWithEmailAndPassword(form.email, form.password)
				.then((creds) => {
					setData(creds)
					updateUsersCollection(creds.user.uid, {
						creationTime: new Date(),
						favoriteTalks: [],
					})
				})
				.then(() => navigate('/account')),
		[auth, setData, updateUsersCollection]
	)

	const logout = React.useCallback(
		() =>
			auth
				.signOut()
				.then(() => setData(null))
				.then(() => navigate('/login')),
		[auth, setData]
	)

	const resetPassword = React.useCallback(
		(form) =>
			auth
				.sendPasswordResetEmail(form.email)
				.then(() => setData(null))
				.then(() => navigate('/login')),
		[auth, setData]
	)

	const unregister = React.useCallback(
		(form) => {
			const user = auth.currentUser
			const credential = firebase.auth.EmailAuthProvider.credential(
				user.email,
				form.password
			)

			return user.reauthenticateWithCredential(credential).then(async () => {
				await db.collection('users').doc(user.uid).delete()
				await user.delete().then(() => setData(null))
				navigate('/')
				return null
			})
		},
		[auth, db, setData]
	)

	const isUser = profile

	const value = React.useMemo(
		() => ({
			login,
			logout,
			register,
			unregister,
			resetPassword,
			isUser,
			profile,
		}),
		[login, logout, register, unregister, resetPassword, isUser, profile]
	)

	if (isLoading || isIdle) {
		return <FullPageLogo />
	}

	if (isError) {
		return <FullPageErrorFallback error={error} />
	}

	if (isSuccess) {
		return <AuthContext.Provider value={value} {...props} />
	}

	throw new Error(`Unhandled status: ${status}`)
}

export { AuthProvider, useAuth }
