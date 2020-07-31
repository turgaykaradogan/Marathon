import React, { useState, useContext, useRef } from 'react';
import useFormProcessor from '../../hooks/useFormProcessor';

import { Context } from '../../providers/global-context.provider';
import { ProjectsContext } from '../../providers/projects-context.provider';
import { TeamsContext } from '../../providers/teams-context.provider';

import { updateTeam, deleteTeam } from '../../services/teams.service';
import { getEmptyInputsErrorsObject } from '../../utils/errors/teams';
import { validateTitle } from '../../utils/validations/teams';

import ErrorMessageContainer from '../messages/form-input-error-message.component';
import FormInput from '../inputs/form-input.component';
import NavLink from '../navigation/nav-link.component';
import CardFormContainer from '../containers/card-form-container.component';

const initialIsEditClicked = false;
const initialError = { name: '', key: '' };

const TeamCard = ({ initialData }) => {
	const {
		data,
		errors,
		setErrors,
		setData,
		handleChange,
		handleOnBlur,
		handleSubmit
	} = useFormProcessor(initialError, {
		...initialData
	});
	const { teams, saveTeams } = useContext(TeamsContext);
	const { token } = useContext(Context);
	const { currentProject } = useContext(ProjectsContext);

	const [ isEditClicked, setIsEditClicked ] = useState(initialIsEditClicked);
	const dataIdRef = useRef(null);

	const saveIdRef = (id) => {
		dataIdRef.current = id;
	};

	const handleUpdate = async () => {
		const { title } = data;
		const id = dataIdRef.current;
		try {
			await updateTeam(currentProject.id, token, id, { title, imageUrl: '' });
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteClick = async () => {
		const id = dataIdRef.current;
		try {
			await deleteTeam(currentProject.id, token, id);
			saveTeams(teams.filter((x) => x.id !== +dataIdRef.current));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<CardFormContainer
			id={initialData.id}
			saveIdRef={saveIdRef}
			isEditClicked={isEditClicked}
			setIsEditClicked={setIsEditClicked}
			initialData={initialData}
			initialError={initialError}
			setData={setData}
			setErrors={setErrors}
			handleDeleteClick={handleDeleteClick}
			handleSubmit={(e) => handleSubmit(e, getEmptyInputsErrorsObject({ title: data.title }), handleUpdate)}
		>
			<div className="pt-1">
				{!isEditClicked ? (
					<NavLink
						to={`/user/dashboard/${currentProject.id}/teams/${data.id}`}
						hoverColor="green-400"
						otherClasses="cursor-pointer text-xl text-gray-900 leading-tight"
					>
						{data.title}
					</NavLink>
				) : (
					<div>
						<FormInput
							autoFocus
							className="focus:outline-none p-1 pl-2 text-xl text-black leading-tight"
							type="text"
							name="title"
							value={data.title}
							onChange={handleChange}
							handleOnBlur={(event) => handleOnBlur(event, validateTitle, { title: data.title })}
							placeholder="Team Title"
						/>
						{errors.title ? <ErrorMessageContainer>{errors.title}</ErrorMessageContainer> : null}
					</div>
				)}
			</div>
		</CardFormContainer>
	);
};

export default TeamCard;
