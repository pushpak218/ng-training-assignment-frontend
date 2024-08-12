import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model'; // Adjust the import path if necessary

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api'; // Update this with your backend API URL
  private urlGetAll=`${this.apiUrl}/tasks`;
  private urlPost=`${this.apiUrl}/task`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all tasks
  getTasks(): Observable<Task[]> {
    
    return this.http.get<Task[]>(this.urlGetAll)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get a single task by ID
  getTask(id: string): Observable<Task> {
    const url = `${this.apiUrl}/task/${id}`;
    return this.http.get<Task>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.urlPost, task, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing task
  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/task/${task._id}`;
    return this.http.put<Task>(url, task, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a task
  deleteTask(taskId: string): Observable<void> {
    const url = `${this.apiUrl}/task/${taskId}`; // Ensure 'tasks' is used and not 'task'
    return this.http.delete<void>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
