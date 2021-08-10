import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'

import { useAuth } from 'context/auth'
import { Page } from 'components/page'
import { Section } from 'components/section'
import { SEO } from 'components/seo'

import { useUsers } from 'hooks/useUsers'
import styles from 'components/styles'
import { useAsync } from 'hooks/useAsync'

function AccountPage({ location }) {
	const { user } = useAuth()
	const { run, isLoading } = useAsync()
	const {
		deleteUserById,
		readUserById,
		readAllUsers,
		setUser,
		updateUser,
		profile,
	} = useUsers()

	if (!user) {
		navigate('/login')
	}

	useEffect(() => {
		run(readUserById(user.uid))
	}, [readUserById, run, user])

	function addFeaturedTalk(userId, talkId) {
		const talks = profile.favoriteTalks || []

		if (talks.includes(talkId)) {
			return
		}

		run(
			updateUser(userId, {
				favoriteTalks: [talkId, ...talks],
			})
		)
	}

	return (
		<>
			<SEO title="Your Account" location={location} />

			<Section>
				<Section.Sidebar>
					<Page.Title>Your Account</Page.Title>

					<div className="flex flex-col gap-4 mt-4">
						<button
							className={styles.button}
							type="button"
							onClick={() =>
								addFeaturedTalk(
									user.uid,
									'0502e2f8-feb2-5dd9-8fc2-5482a26b38fa'
								)
							}
						>
							Add featured talk
						</button>
						<hr />
						<button
							className={styles.button}
							type="button"
							onClick={() =>
								setUser(
									user.uid,
									{
										updatedTime: new Date(),
										favoriteTalks: [
											'6cac2356-23a9-5f80-8283-02d201e371e5',
											'5c2c77dd-1bca-557e-a14a-c5f2273a5a1d',
											'932efc94-bacd-5ea9-a494-5b80120bb279',
										],
									},
									{ merge: false }
								)
							}
						>
							Reset user
						</button>

						<button
							className={styles.button}
							type="button"
							onClick={() =>
								updateUser(user.uid, {
									name: 'Luke McDonald',
									age: 39,
								})
							}
						>
							Update user
						</button>

						<button
							className={styles.button}
							type="button"
							onClick={() => readAllUsers()}
						>
							Read all users
						</button>

						<button
							className={styles.button}
							type="button"
							onClick={() => run(readUserById(user.uid))}
						>
							Read user by ID
						</button>

						<button
							className={styles.button}
							type="button"
							onClick={() => deleteUserById(user.uid)}
						>
							Delete user by ID
						</button>
					</div>
				</Section.Sidebar>

				<Section.Content>
					<h2 className="text-xl font-bold">Profile Data</h2>
					{profile && (
						<pre className="mt-6">
							<ul className="prose">
								{Object.keys(profile).map((key) => (
									<li key={key}>
										<strong>{key}:</strong>
										{key === 'favoriteTalks' && profile[key] && (
											<ol>
												{profile[key].map((data, index) => (
													<li key={`favoriteTalk-${index}`}>
														{data.toString()}
													</li>
												))}
											</ol>
										)}

										{key !== 'favoriteTalks' && profile[key].toString()}
									</li>
								))}
							</ul>
						</pre>
					)}
				</Section.Content>
			</Section>
		</>
	)
}

export default AccountPage
