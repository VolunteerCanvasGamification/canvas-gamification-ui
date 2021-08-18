import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/_services/api/authentication';
import {ActivatedRoute} from '@angular/router';
import {CourseRegistration, User} from '@app/_models';
import {CourseDashboardServiceService} from "@app/course/_services/course-dashboard.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {CourseDashboardForm} from "@app/course/_forms/course-dashboard.form";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {AdminService} from "@app/_services/api/admin.service";
import {CourseService} from "@app/course/_services/course.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-course-dashboard',
    templateUrl: './course-dashboard.component.html',
    styleUrls: ['./course-dashboard.component.scss']
})

export class CourseDashboardComponent implements OnInit {
    courseList: MatTableDataSource<Course>;
    formGroup: FormGroup;
    formGroupReg: FormGroup;
    courseId: number;
    userId: number;
    user: User;

    userList: User[];
    registrationList: CourseRegistration[];
    variable: boolean;

    filterQueryString;

    pageSize: number;

    paramChanged: Subject<{
        name: string;
        courseId: number;
    }> = new Subject<{
        name: string;
        courseId: number;
    }>();

    userCourseList: User[];
    courseRegId: number;
    courseNamesList: Course[];

    constructor(private builder: FormBuilder,
                private adminService: AdminService,
                private courseService: CourseService,
                private authenticationService: AuthenticationService,
                private courseDashboardService: CourseDashboardServiceService,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
        this.authenticationService.currentUser.subscribe(user => this.user = user);
        this.formGroup = CourseDashboardForm.createForm();
        this.courseId = this.route.snapshot.params.courseId;
        this.paramChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe(options => {
            this.courseDashboardService.getCourseDashboardFilter(options, this.courseId).subscribe(users => this.userList = users);
        });

    }

    get form(): { [p: string]: AbstractControl } {
        return this.formGroup.controls;
    }

    ngOnInit(): void {

        this.courseDashboardService
            .getCourseDashboard(this.courseId)
            .subscribe(users => {
                this.userList = users;
            });

        this.courseDashboardService
            .getCourseRegistration(this.courseId)
            .subscribe(registrations => {
                this.registrationList = registrations;
            });
    }

    changeStatus(courseReg: CourseRegistration, blockStatus: boolean, verifyStatus: boolean): void {
        const updatedCourseRegistration: CourseRegistration = {
            id: courseReg.id,
            canvas_user_id: courseReg.canvas_user_id,
            is_verified: verifyStatus,
            is_blocked: blockStatus,
            token_uses: courseReg.token_uses,
            total_tokens_received: courseReg.total_tokens_received,
            available_tokens: courseReg.available_tokens,
            user_id: courseReg.user_id,
        };
        this.courseDashboardService.updateBlockStatus(updatedCourseRegistration)
            .subscribe(() => {
                this.toastr.success('The action was performed successfully.');
                this.courseDashboardService
                    .getCourseRegistration(this.courseId)
                    .subscribe(registrations => {
                        this.registrationList = registrations;
                    });
            }, error => {
                this.toastr.error(error);
                console.warn(error);
            });
    }

    getBlockStatus(id: number): boolean {
        return this.registrationList.filter(reg => reg.user_id === id)[0].is_blocked;
    }

    getVerifyStatus(id: number): boolean {
        return this.registrationList.filter(reg => reg.user_id === id)[0].is_verified;
    }

    open(content: unknown): void {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, scrollable: true});
    }

    permission(content: unknown, regId: number): void {
        this.courseRegId = regId;
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-permission', centered: true});
    }

    unregisterUser(): void {
        this.courseDashboardService.unregisterUser(this.courseRegId)
            .subscribe(() => {
                this.toastr.success('The user has been unregistered.');
                this.courseDashboardService
                    .getCourseDashboard(this.courseId)
                    .subscribe(users => {
                        this.userList = users;
                    });
            }, error => {
                this.toastr.error(error);
                console.warn(error);
            });
    }

    update(): void {
        const options = {
            ...this.filterQueryString,
        };
        this.paramChanged.next(options);
    }

    hasViewPermission(userId: number): boolean {
        return this.user.is_teacher || !!this.registrationList.find(course => course.canvas_user_id === userId);
    }

    applyFilter(): void {
        this.filterQueryString = this.formGroup.value;
        this.update();
    }
}
