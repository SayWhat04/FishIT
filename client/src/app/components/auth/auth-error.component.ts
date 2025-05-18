import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { fadeInOut } from '../../animations/fade.animation';

@Component({
  selector: 'app-auth-error',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss'],
  animations: [fadeInOut],
})
export class AuthErrorComponent {
  @Input() message: string | null = null;
}
