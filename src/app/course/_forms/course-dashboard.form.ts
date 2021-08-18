import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

export class CourseDashboardForm {
    /**
     * Creates a FormGroup for the course dashboard.
     */
    static createForm(): FormGroup {
        const builder = new FormBuilder();
        return builder.group({
            search: new FormControl('')
        });
    }

    /**
     * Extracts the data from the FormGroup.
     * @param form - The FormGroup for the problem set.
     */
    static extractData(form: FormGroup): CourseDashboardFormData {
        return form.value;
    }
}

export interface CourseDashboardFormData {
    search: string,
}

export class CourseDashboardRegForm {
    /**
     * Creates a FormGroup for the course dashboard.
     */
    static createForm(): FormGroup {
        const builder = new FormBuilder();
        return builder.group({
            regUser: new FormControl('')
        });
    }

    /**
     * Extracts the data from the FormGroup.
     * @param form - The FormGroup for the problem set.
     */
    static extractData(form: FormGroup): CourseDashboardRegFormData {
        return form.value;
    }
}

export interface CourseDashboardRegFormData {
    regUser: string
}
