import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../../services/box.service';
import { CreateBoxCommand } from '@shared/types/commands';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-box-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TextFieldModule,
  ],
  templateUrl: './add-box-dialog.component.html',
  styleUrls: ['./add-box-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBoxDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddBoxDialogComponent>);
  private boxService = inject(BoxService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const command: CreateBoxCommand = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
      };

      this.boxService.createBox(command).subscribe({
        next: box => {
          this.snackBar.open('Box created successfully', 'OK', { duration: 3000 });
          this.dialogRef.close(box);
        },
        error: error => {
          console.error('Error creating box:', error);
          this.snackBar.open('Failed to create box. Please try again.', 'OK', { duration: 5000 });
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
