import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../services/box.service';
import { UpdateBoxCommand } from '@shared/types/commands';
import { BoxDto } from '@shared/types/dto';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';

export interface EditBoxDialogData {
  box: BoxDto;
}

@Component({
  selector: 'app-edit-box-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './edit-box-dialog.component.html',
  styleUrls: ['./edit-box-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBoxDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditBoxDialogComponent>);
  private boxService = inject(BoxService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  originalBox: BoxDto;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditBoxDialogData) {
    this.originalBox = data.box;
    
    this.form = this.fb.group({
      name: [this.originalBox.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.originalBox.description || '', [Validators.maxLength(500)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const command: UpdateBoxCommand = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
      };

      // Check if anything actually changed
      if (command.name === this.originalBox.name && 
          command.description === (this.originalBox.description || '')) {
        this.snackBar.open('No changes were made', 'OK', { duration: 3000 });
        this.dialogRef.close();
        return;
      }

      this.boxService.updateBox(this.originalBox.id, command).subscribe({
        next: updatedBox => {
          this.snackBar.open('Box updated successfully', 'OK', { duration: 3000 });
          this.dialogRef.close(updatedBox);
        },
        error: error => {
          console.error('Error updating box:', error);
          this.snackBar.open('Failed to update box. Please try again.', 'OK', { duration: 5000 });
        },
      });
    }
  }

  onCancel(): void {
    // Check if form has been modified
    const hasChanges = this.form.get('name')?.value !== this.originalBox.name ||
                      this.form.get('description')?.value !== (this.originalBox.description || '');
    
    if (hasChanges) {
      // You could add a confirmation dialog here if needed
      // For now, just close
    }
    
    this.dialogRef.close();
  }

  onReset(): void {
    this.form.patchValue({
      name: this.originalBox.name,
      description: this.originalBox.description || ''
    });
  }
} 