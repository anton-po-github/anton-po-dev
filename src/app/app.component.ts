import { Component, signal, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

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
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  // --- Services for SEO ---
  private meta = inject(Meta);
  private titleService = inject(Title);

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

  ngOnInit(): void {
    // --- SEO Configuration ---
    // Sets the tab title in the browser
    this.titleService.setTitle('Anton.Po | Senior Full Stack .NET & Angular Developer');

    // Sets meta tags for Google, Twitter, LinkedIn previews
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Senior Full Stack Developer specialized in Angular v21, .NET 10, and Azure. Architecting high-performance web solutions.',
      },
      {
        name: 'keywords',
        content: 'Angular, .NET, Azure, Full Stack Developer, TypeScript, C#, Software Architect',
      },
      { name: 'author', content: 'Anton.Po' },
      { name: 'robots', content: 'index, follow' }, // Tells Google to index this page
      { property: 'og:title', content: 'Anton.Po - High-Performance Web Solutions' },
      {
        property: 'og:description',
        content: 'Building the next web with Angular v21 and .NET 10.',
      },
      { property: 'og:image', content: 'assets/anton-po.png' }, // Ensure this path is absolute in production
      { property: 'og:type', content: 'website' },
    ]);
  }

  scrollToHire(): void {
    document.getElementById('hire-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
