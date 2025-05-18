import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenerateFlashcardsCommand } from '@shared/types/commands';

@Component({
  selector: 'app-generate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './generate-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateFormComponent {
  @Input() set isLoading(value: boolean) {
    this._isLoading.set(value);
  }

  @Output() generate = new EventEmitter<GenerateFlashcardsCommand>();

  _isLoading = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(10000)]],
      count: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
    });
  }

  getLoadingState(): boolean {
    return this._isLoading();
  }

  clear(): void {
    this.form.reset({
      text: '',
      count: 10,
    });
  }

  submit(): void {
    if (this.form.valid && !this._isLoading()) {
      const command: GenerateFlashcardsCommand = {
        text: this.form.get('text')?.value || '',
        count: this.form.get('count')?.value || 10,
      };

      this.generate.emit(command);
    }
  }
}
