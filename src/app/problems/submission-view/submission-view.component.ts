import {Component, OnInit} from '@angular/core';
import {SubmissionService} from '@app/problems/_services/submission.service';
import {QuestionSubmission, StatusMessage} from '@app/_models/question_submission';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-submission-view',
    templateUrl: './submission-view.component.html',
    styleUrls: ['./submission-view.component.scss'],
})
export class SubmissionViewComponent implements OnInit {
    submission: QuestionSubmission;
    hasErrorMessage = false;
    answerFiles: { name: string, code: string }[];

    constructor(private submissionService: SubmissionService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.submissionService.getSubmission(id).subscribe(submission => {
            this.submission = submission;
            this.hasErrorMessage = submission.get_status_message !== StatusMessage.ACCEPTED;

            this.answerFiles = [];
            for (const key of Object.keys(submission.answer_files)) {
                this.answerFiles.push({
                    name: key,
                    code: submission.answer_files[key],
                });
            }
        });
    }

}
