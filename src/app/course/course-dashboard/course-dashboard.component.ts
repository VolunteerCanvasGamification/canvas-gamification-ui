import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/_services/api/authentication';
import {ActivatedRoute} from '@angular/router';
import {CourseAdminRegistrationRequest, CourseRegistration, CourseRegistrationRequest, User} from '@app/_models';
import {CourseDashboardServiceService} from "@app/course/_services/course-dashboard.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-course-dashboard',
    templateUrl: './course-dashboard.component.html',
    styleUrls: ['./course-dashboard.component.scss']
})

export class CourseDashboardComponent implements OnInit {
    courseId: number;
    user: User;
    userList: User[];
    unregisteredUsers: User[];
    registrationList: CourseRegistration[];
    variable: boolean;

    constructor(private authenticationService: AuthenticationService,
                private courseService: CourseDashboardServiceService,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
        this.authenticationService.currentUser.subscribe(user => this.user = user);
        this.courseId = this.route.snapshot.params.courseId;
    }

    ngOnInit(): void {
        this.courseService
            .getCourseDashboard(this.courseId)
            .subscribe(users => {
                this.userList = users;
            });

        this.courseService
            .getCourseRegistration(this.courseId)
            .subscribe(registrations => {
                this.registrationList = registrations;
            });

        this.courseService
            .getUnregistered(this.courseId)
            .subscribe( users=> {
                this.unregisteredUsers = users;
            });
    }

    updateBlockStatus(courseReg: CourseRegistration): void {
        const updatedCourseRegistration: CourseRegistration = {
            id: courseReg.id,
            canvas_user_id: courseReg.canvas_user_id,
            is_verified: courseReg.is_verified,
            is_blocked: !courseReg.is_blocked,
            token_uses: courseReg.token_uses,
            total_tokens_received: courseReg.total_tokens_received,
            available_tokens: courseReg.available_tokens,
        };
        this.courseService.updateBlockStatus(updatedCourseRegistration)
            .subscribe(() => {
                this.toastr.success('The block has been changed successfully.');
                this.courseService
                    .getCourseRegistration(this.courseId)
                    .subscribe(registrations => {
                        this.registrationList = registrations;
                    });
            }, error => {
                this.toastr.error(error);
                console.warn(error);
            });
    }

    register(userInput: User): void {
        const data = this.retrieveFormData();
    }

    retrieveFormData(): CourseAdminRegistrationRequest {
        return {
            name: this.user.first_name + this.user.last_name || null,
        };
    }

    open(content: unknown): void {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, scrollable: true, size : "xl"});
    }


}
