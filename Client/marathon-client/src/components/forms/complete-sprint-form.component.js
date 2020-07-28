import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { completeSprint } from '../../services/sprints.service';

import { Context } from '../../providers/global-context.provider';
import { ProjectsContext } from '../../providers/projects-context.provider';
import { IssuesContext } from '../../providers/issues-context.provider';
import { SprintsContext } from '../../providers/sprints-context.provider';

import CustomLabel from '../labels/custom-label.component';
import CustomSelect from '../select/custom-select.component';
import InfoMessageContainer from '../messages/form-input-info-message.component';

const CompleteSprintForm = ({ children }) => {
	const { currentProject } = useContext(ProjectsContext);
	const { toggleModalIsOpen, saveAlert } = useContext(Context);
	const { backlogIssuesCollections, boardIssuesCollections } = useContext(IssuesContext);
	const { toggleCompletingSprint } = useContext(SprintsContext);
	const [ sprintId, setSprintId ] = useState(null);
	const [ sprints, setSprints ] = useState(null);
	const [ completed, setCompleted ] = useState('');
	const [ uncompleted, setUncompleted ] = useState('');
	const history = useHistory();

	useEffect(() => {
		const mappedSprints = backlogIssuesCollections
			.filter((x) => x.id !== currentProject.activeSprintId)
			.map((x, i) => {
				return {
					id: i < backlogIssuesCollections[backlogIssuesCollections.length - 1] ? x.id : '',
					title: i < backlogIssuesCollections[backlogIssuesCollections.length - 1] ? x.title : 'Backlog'
				};
			});

		const completedIssuesCount = boardIssuesCollections.filter((x) => x.title === 'Done')[0].issues.length;
		const unCompletedIssuesCount = boardIssuesCollections.filter((x) => x.title !== 'ToDo').reduce((acc, curr) => {
			return acc + curr.issues.length;
		}, 0);
		setCompleted(completedIssuesCount);
		setUncompleted(unCompletedIssuesCount);
		setSprints(mappedSprints);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (event) => {
		const { value } = event.target;
		setSprintId(value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const success = await completeSprint();

		if (success) {
			toggleModalIsOpen();
			toggleCompletingSprint();
			saveAlert('Sprint successfully completed!');
			history.push(`/user/dashboard/${currentProject.id}/backlog`);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="container px-5 py-2 mx-auto"
			onKeyPress={(e) => {
				e.key === 'Enter' && e.preventDefault();
			}}
		>
			<div className="flex flex-col text-center w-full mb-4">
				<p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					{`Complete Sprint: ${currentProject.key} ${backlogIssuesCollections[0].title}`}
				</p>
			</div>
			<div className="lg:w-2/3 md:w-2/3 mx-auto justify-between">
				<div className="py-2 w-full">
					<span className="rounded-full h-5 w-5 flex items-center justify-center bg-green-300 text-black">
						{completed}
					</span>
					<span className="inline-flex">issues were done</span>
				</div>
				<div className="pb-12 w-full">
					<span className="rounded-full h-5 w-5 flex items-center justify-center bg-red-300 text-black">
						{uncompleted}
					</span>
					<span className="inline-block">issue was incomplete</span>{' '}
				</div>
				<div className="flex flex-wrap -m-2">
					<div className="p-2 w-full">
						<InfoMessageContainer addClass="mb-2">
							Select where all the incomplete issues should be moved:
						</InfoMessageContainer>
						<div className="flex flex-wrap -mx-3 mb-2">
							{sprints ? (
								<CustomSelect
									disabled={false}
									label={<CustomLabel labelFor="sprintId">Move to:</CustomLabel>}
									value={sprintId}
									name="sprintId"
									handleChange={handleChange}
								>
									{sprints.map((x) => (
										<option key={x.id} value={x.id}>
											{x.title}
										</option>
									))}
								</CustomSelect>
							) : null}
						</div>
					</div>
					<div className="p-2 w-full">{children}</div>
				</div>
			</div>
		</form>
	);
};

export default CompleteSprintForm;
