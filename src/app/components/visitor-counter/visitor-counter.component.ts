import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorTrackingService } from '../../services/visitor-tracking.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-visitor-counter',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="visitor-counter">
      <div class="counter-content">
        <i class="pi pi-users"></i>
        <span class="counter-number">{{ visitorCount$ | async }}</span>
        <span class="counter-label">Visitors</span>
      </div>
    </div>
  `,
    styles: [`
    .visitor-counter {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .visitor-counter:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .counter-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
    }

    .counter-content i {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .counter-number {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      min-width: 2rem;
      text-align: center;
    }

    .counter-label {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .visitor-counter {
        padding: 0.4rem 0.75rem;
      }

      .counter-content {
        gap: 0.4rem;
      }

      .counter-content i {
        font-size: 1rem;
      }

      .counter-number {
        font-size: 1rem;
      }

      .counter-label {
        font-size: 0.75rem;
      }
    }
  `]
})
export class VisitorCounterComponent implements OnInit {
    visitorCount$: Observable<number>;

    constructor(private visitorService: VisitorTrackingService) {
        this.visitorCount$ = this.visitorService.getVisitorCount$();
    }

    ngOnInit(): void {
        // Visitor tracking is automatically initialized in the service
    }
}
