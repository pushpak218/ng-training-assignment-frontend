import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Import any necessary modules
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task = { _id: '', title: '', description: '', dueDate: '', priority: '', assignedTo: '', comment: '', status: '' };

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTask(id).subscribe({
        next: (task) => {
          this.task = task;
          this.task.dueDate = this.convertISOToDateString(task.dueDate);
        },
        error: (err) => console.error('Error fetching task', err)
      });
    }
  }

  convertISOToDateString(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  }

  convertDateStringToISO(dateString: string): string {
    return new Date(dateString).toISOString();
  }

  onSubmit(form: NgForm): void {
    // Convert date to ISO string before submitting
    this.task.dueDate = this.convertDateStringToISO(this.task.dueDate);

    if (this.task._id) {
      this.taskService.updateTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error updating task', err)
      });
    } else {
      this.taskService.addTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error adding task', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
