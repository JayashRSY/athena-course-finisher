import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  userForm!: any;
  courseList: any;
  selectedCourse: any;
  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      token: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this._dataService
        .getUserData(
          this.userForm.controls.userId.value.toLowerCase(),
          this.userForm.controls.token.value
        )
        .subscribe((res: any) => {
          if (res.isSuccess) {
            localStorage.setItem(
              'athena-token',
              this.userForm.controls.token.value
            );
            // this._dataService.getAllAssignedCourses().subscribe((res: any) => {
            //   if (res.isSuccess) {
            //     this.courseList = res.data.courseCandidatesDTO;
            //   }
            // });
            this._dataService.getAllPaginatedAssignedCourses().subscribe((res: any) => {
              if (res.isSuccess) {
                this.courseList = res.data.paginatedData.courseCandidatesDTO;
              }
            });

          } else {
            alert('Error in User Id/Token');
          }
        });
    } else {
      // Mark form controls as touched to display validation errors
      this.userForm.markAllAsTouched();
    }
  }
  getCourseDetails(course: any) {
    // this._dataService
    //   .getCourseDetails(course)
    //   .subscribe((res: any) => {
    //     if (res.isSuccess) {
    //       this.selectedCourse = res.data;
    //     }
    //     console.log('Get Course Details : ', res);
    //   });

    this._dataService.fetchCourseContent(course);
  }
}
