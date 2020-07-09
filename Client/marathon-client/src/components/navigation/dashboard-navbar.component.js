import React, { useContext } from 'react';

import { ProjectsContext } from '../../providers/projects-context.provider';

import DashboardNavItem from './dashboard-navbar-item.component';

const DashboardNavBar = ({ otherClasses }) => {
	const { currentProject } = useContext(ProjectsContext);

	return (
		<div className={`${otherClasses} bg-gray-100 text-center h-10 border-b-2 border-t-1`}>
			<div className=" mx-auto px-10">
				<ul className="list-reset flex flex-row text-center">
					<DashboardNavItem type="inactive" to="/">
						<p>{currentProject ? currentProject.name : 'Choose Project'}</p>
					</DashboardNavItem>
					<DashboardNavItem type="active" to="/">
						Board
					</DashboardNavItem>
					<DashboardNavItem type="inactive" to="/">
						Backlog
					</DashboardNavItem>
					<DashboardNavItem type="inactive" to="/">
						Team
					</DashboardNavItem>
				</ul>
			</div>
		</div>
	);
};

export default DashboardNavBar;
