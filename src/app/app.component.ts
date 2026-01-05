import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

interface TechItem {
  name: string;
  iconName: string;
  group: string;
}
interface ExperienceItem {
  title: string;
  description: string;
  result: string;
  tech: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './app.component.html',
  // No inline styles here, we use global SCSS for reliable background animations
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // --- Signals State ---
  readonly techStack = signal<TechItem[]>([
    { name: 'Angular', iconName: 'ng.svg', group: 'Frontend' },
    { name: '.NET', iconName: 'dotnet.svg', group: 'Backend' },
    { name: 'Azure', iconName: 'azure.svg', group: 'Cloud' },
    { name: 'PostgreSQL', iconName: 'pgsql.svg', group: 'DB' },
  ]);

  readonly experience = signal<ExperienceItem[]>([
    {
      title: 'Enterprise CRM Transformation',
      description:
        'Transformed a legacy CRM into a modern, extensible Angular v21 product that improved developer velocity and enabled rapid feature delivery aligned with customer needs.',
      result:
        'Accelerated release cadence from monthly to weekly and increased customer adoption by 25%.',
      tech: 'Angular v21, RxJS, NgRx, TypeScript',
    },
    {
      title: 'Scalable Azure Platform for Growth',
      description:
        'Built a cost-efficient, scalable backend to support rapid user growth while preserving performance SLAs. Partnered with product and ops to align costs and SLOs with roadmap goals.',
      result:
        'Supported 3× user growth without service degradation; reduced operational costs by 30%.',
      tech: '.NET 10, Azure Functions, PostgreSQL, Azure.Storage.Blobs',
    },
    {
      title: 'End-to-End Feature Delivery',
      description:
        'Led cross-functional deliveries from concept to production — requirements, architecture, implementation, testing and monitoring — ensuring high quality and timely launches.',
      result: 'Delivered multiple high-impact features on schedule, improving retention and NPS.',
      tech: 'Agile, CI/CD, Unit & E2E testing, Telemetry',
    },
  ]);

  readonly currentYear = signal(new Date().getFullYear());

  scrollToHire(): void {
    document.getElementById('hire-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
