import React from 'react'
import { AuthProvider, useAuth } from '../context/auth'

import { Link } from '../components/link'
import { Section } from '../components/section'
import { Page } from '../components/page'
import { LoginForm } from '../components/forms/login'

function Register() {
	const { register, user } = useAuth()
	return (
		<>
			<LoginForm onSubmit={register} buttonText="Register" />
			{!user && (
				<p>
					Already have an account? <Link to="/login">Login here!</Link>
				</p>
			)}
		</>
	)
}

function RegisterPage() {
	return (
		<Section>
			<Section.Content>
				<div className="prose">
					<Page.Title>Register</Page.Title>
					<AuthProvider>
						<Register />
					</AuthProvider>
				</div>
			</Section.Content>
		</Section>
	)
}

export default RegisterPage
