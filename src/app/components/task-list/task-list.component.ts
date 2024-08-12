import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],  // Import any necessary modules
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private router: Router) { }

  // Method to handle editing a task
  editTask(task: Task) {
    // Navigate to the form with the task ID as a parameter
    this.router.navigate(['/task-form', task._id]);
  }

  // Method to handle deleting a task
  deleteTask(taskId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          // Refresh the list after deletion
          this.tasks = this.tasks.filter(task => task._id !== taskId);
        },
        error: (err) => console.error('Error deleting task', err)
      });
    }
  }
  

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
}
