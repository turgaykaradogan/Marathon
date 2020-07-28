import React, { useContext } from 'react';

import { Context } from '../../providers/global-context.provider';
import { SprintsContext } from '../../providers/sprints-context.provider';

import ModalContainer from '../containers/modal-container.component';
import CompleteSprintForm from '../forms/complete-sprint-form.component';
import SubmitButton from '../buttons/submit-button.component';

const CompleteSprintModal = () => {
	const { toggleModalIsOpen } = useContext(Context);
	const { completingSprint, toggleCompletingSprint } = useContext(SprintsContext);

	const handleClose = () => {
		toggleModalIsOpen();
		toggleCompletingSprint();
	};

	return (
		<ModalContainer onClose={handleClose} show={completingSprint} addBgColor="bg-black bg-opacity-25">
			<CompleteSprintForm>
				<div className="flex md:mt-4 mt-6">
					<SubmitButton>Complete</SubmitButton>
				</div>
			</CompleteSprintForm>
		</ModalContainer>
	);
};

export default CompleteSprintModal;
