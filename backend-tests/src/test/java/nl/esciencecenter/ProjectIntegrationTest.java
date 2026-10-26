// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import java.util.UUID;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({ SetupAllTests.class })
public class ProjectIntegrationTest {

	@Test
	void givenProject_whenViewingTestimonials_thenTheAppropriateTestimonialsReturned() {
		User projectMaintainer = User.create(true);

		Project project = Project.createNewProject(
			projectMaintainer,
			"Unpublished project " + Commons.generateRandomShortString()
		);

		project.addTestimonial(
			projectMaintainer,
			"Awesome project " + Commons.generateRandomShortString() + "!",
			"backend tests " + Commons.generateRandomShortString() + "!"
		);

		User nonMaintainer = User.create(true);

		Assertions.assertEquals(1, project.getTestimonialIds(projectMaintainer).size());
		Assertions.assertEquals(1, project.getTestimonialIds(nonMaintainer).size());
		Assertions.assertEquals(1, project.getTestimonialIds().size());

		project.unpublish(projectMaintainer);
		Assertions.assertEquals(1, project.getTestimonialIds(projectMaintainer).size());
		Assertions.assertEquals(0, project.getTestimonialIds(nonMaintainer).size());
		Assertions.assertEquals(0, project.getTestimonialIds().size());
	}

	@Test
	void givenProject_whenDeletingTestimonial_thisOnlySucceedsWhenMaintainerOrAdmin() {
		User projectMaintainer = User.create(true);

		Project project = Project.createNewProject(
			projectMaintainer,
			"Published project " + Commons.generateRandomShortString()
		);

		UUID testimonialId = project.addTestimonial(
			projectMaintainer,
			"Awesome project " + Commons.generateRandomShortString() + "!",
			"backend tests " + Commons.generateRandomShortString() + "!"
		);

		project.deleteTestimonial(testimonialId);
		Assertions.assertEquals(1, project.getTestimonialIds(projectMaintainer).size());

		User nonMaintainer = User.create(true);
		project.deleteTestimonial(nonMaintainer, testimonialId);
		Assertions.assertEquals(1, project.getTestimonialIds(projectMaintainer).size());

		project.deleteTestimonial(projectMaintainer, testimonialId);
		Assertions.assertEquals(0, project.getTestimonialIds(projectMaintainer).size());
	}
}
