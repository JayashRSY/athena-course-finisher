import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  token: any;
  userId: any;
  constructor(private _httpClient: HttpClient) {}
  getUserData(userId: any, token: any) {
    this.userId = userId;
    this.token = token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.token,
    };
    return this._httpClient.get<any>(
      `https://eapi.geminisolutions.com/gemassessment/api/getCandidateAnalytics/${this.userId}`,
      { headers }
    );
  }
  getAllAssignedCourses() {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.token,
    };
    return this._httpClient.post<any>(
      `https://eapi.geminisolutions.com/gemassessment/api/getAllAssignedCourses`,
      {
        userId: this.userId,
        searchParam: '',
        pageNumber: 0,
        categoryId: 0,
        isCompleted: false,
        isCourseExpired: false,
        year: 0,
      },
      { headers }
    );
  }
  getCourseDetails(courseCandidateId: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.token,
    };
    return this._httpClient.get<any>(
      `https://eapi.geminisolutions.com/gemassessment/api/getCandidateCourse/${courseCandidateId}`,
      { headers }
    );
  }
  async fetchCourseContent(
    course: any
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.token,
    };
    const results: any[] = [];

    for (const item of course.courses.contents) {
      let payload = {
        courseContentId: item.courseContentId,
        courseCandidateId: course.courseCandidateId,
        courseMasterId: course.courses.courseMasterId,
        courseAssignmentId: null,
        courseTestId: null,
        assignmentDescription: null,
        isContent: true,
        isTest: false,
        isAssignment: false,
        isCompleted: true,
        totalTime: item.contentMaster.duration,
      };
      try {
        const result = await this._httpClient
          .post<any>(
            `https://eapi.geminisolutions.com/gemassessment/api/updateProgress`,
            payload,
            { headers }
          )
          .toPromise();
        results.push(result);
      } catch (error) {
        console.error('Error in sequential request:', error);
      }
    }

    return results;
  }
}
