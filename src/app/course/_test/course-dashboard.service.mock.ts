import {Observable, of} from "rxjs";
import {CourseRegistration, CourseRegistrationStatus} from "@app/_models";
import {MOCK_COURSE_REGISTRATION} from "@app/course/_test/mock";
import {CourseDashboardFormData} from "@app/course/_forms/course-dashboard.form";

export class CourseDashboardServiceMock{
    getCourseUsers(id: number): Observable<CourseRegistration[]> {
        return of([MOCK_COURSE_REGISTRATION]);
    }

    updateStatus(data: CourseRegistrationStatus, courseId : number): Observable<CourseRegistration> {
        return of(MOCK_COURSE_REGISTRATION);
    }

    getCourseUsersFilter(courseId: number, options?: CourseDashboardFormData): Observable<CourseRegistration[]> {
        return of([MOCK_COURSE_REGISTRATION]);
    }
}
