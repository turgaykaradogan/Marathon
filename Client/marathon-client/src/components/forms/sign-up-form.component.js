import React, { useContext, useState } from 'react';
import { Context } from '../../providers/global-context.provider';
import { registerUser } from '../../utils/user';
import {
	validatePassword,
	validateConfirmPassword,
	validateUsername,
	validateEmail,
	validateFirstName,
	validateLastName
} from '../../utils/validator';
import { getServerErrorsObject, getEmptyInputsErrorsObject } from '../../utils/error-messages';
import ErrorMessageContainer from '../../components/messages/form-input-error-message.component';
import FormInput from './form-input.component';
import FormButton from './form-button.component';

const initialUser = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	password: '',
	confirmPassword: ''
};

const SignUpForm = ({ classes, ...otherProps }) => {
	const { toggleLoggedIn, saveToken } = useContext(Context);
	const [ user, setUser ] = useState(initialUser);
	const [ errors, setErrors ] = useState({});

	const handleChange = (event) => {
		const { value, name } = event.target;
		setUser({ ...user, [name]: value });
		setErrors({ ...errors, [name]: '' });
	};

	const handleOnBlur = (event, validationFunc, data) => {
		const { name } = event.target;
		const { error } = validationFunc(data);

		if (error) {
			return setErrors({ ...errors, [name]: error });
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (Object.keys(errors).some((key) => errors[key] !== '')) {
			return;
		}

		const errorsObject = getEmptyInputsErrorsObject({ ...user });
		if (Object.keys(errorsObject).some((key) => errorsObject[key] !== '')) {
			return setErrors({ ...errors, ...errorsObject });
		}
		const { firstName, lastName, username, email, password } = user;
		const fullName = `${firstName} ${lastName}`;
		const result = await registerUser({ fullName, username, email, password });

		if (result.token) {
			toggleLoggedIn(fullName);
			saveToken(result.token);
		} else {
			const errorsObject = getServerErrorsObject(result);
			setErrors({ ...errors, ...errorsObject });
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`lg:w-2/6 md:w-1/2 rounded-lg p-8 flex flex-col md:ml-0 w-full mt-10 md:mt-0 ${classes}`}
			{...otherProps}
		>
			<h2 class="text-gray-900 text-lg font-medium title-font mb-5">SIGN UP</h2>
			<FormInput
				type="text"
				name="firstName"
				value={user.firstName}
				placeholder="First Name"
				handleOnBlur={(event) => handleOnBlur(event, validateFirstName, { firstName: user.firstName })}
				handleChange={handleChange}
			/>
			{errors.firstName ? <ErrorMessageContainer>{errors.firstName}</ErrorMessageContainer> : null}

			<FormInput
				type="text"
				name="lastName"
				value={user.lastName}
				placeholder="Full Name"
				handleOnBlur={(event) => handleOnBlur(event, validateLastName, { lastName: user.lastName })}
				handleChange={handleChange}
			/>
			{errors.lastName ? <ErrorMessageContainer>{errors.lastName}</ErrorMessageContainer> : null}

			<FormInput
				type="text"
				name="username"
				value={user.username}
				placeholder="Username"
				handleOnBlur={(event) => handleOnBlur(event, validateUsername, { username: user.username })}
				handleChange={handleChange}
			/>
			{errors.username ? <ErrorMessageContainer>{errors.username}</ErrorMessageContainer> : null}

			<FormInput
				type="email"
				name="email"
				value={user.email}
				placeholder="Email"
				handleOnBlur={(event) => handleOnBlur(event, validateEmail, { email: user.email })}
				handleChange={handleChange}
			/>
			{errors.email ? <ErrorMessageContainer>{errors.email}</ErrorMessageContainer> : null}

			<FormInput
				type="password"
				name="password"
				value={user.password}
				placeholder="Password"
				handleOnBlur={(event) => handleOnBlur(event, validatePassword, { password: user.password })}
				handleChange={handleChange}
			/>
			{errors.password ? <ErrorMessageContainer>{errors.password}</ErrorMessageContainer> : null}

			<FormInput
				type="password"
				name="confirmPassword"
				value={user.confirmPassword}
				placeholder="Confirm Password"
				handleOnBlur={(event) =>
					handleOnBlur(event, validateConfirmPassword, {
						password: user.password,
						confirmPassword: user.confirmPassword
					})}
				handleChange={handleChange}
			/>
			{errors.confirmPassword ? <ErrorMessageContainer>{errors.confirmPassword}</ErrorMessageContainer> : null}

			<FormButton>SUBMIT</FormButton>
		</form>
	);
};

export default SignUpForm;
