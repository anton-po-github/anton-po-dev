import { Component, signal, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface TechItem {
  name: string;
  iconName: string;
  group: string;
}

export interface ExperienceItem {
  title: string;
  company?: string;
  description: string;
  result: string;
  tech: string;
  url?: string;
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
  private meta = inject(Meta);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);

  readonly techStack = signal<TechItem[]>([
    { name: 'Angular', iconName: 'ng.svg', group: 'Frontend' },
    { name: '.NET', iconName: 'dotnet.svg', group: 'Backend' },
    { name: 'Azure', iconName: 'azure.svg', group: 'Cloud' },
    { name: 'PostgreSQL', iconName: 'pgsql.svg', group: 'DB' },
  ]);

  readonly experience = signal<ExperienceItem[]>([
    {
      title: 'Team Lead & Software Architect',
      company: 'Aegitox',
      url: 'https://aegitox.com/',
      result: '',
      description:
        'Spearheaded the full-stack architecture of an enterprise Discord moderation platform. Engineered the NativeIntentEngine in .NET 10—a deterministic, hardware-accelerated inference pipeline executing in strict O(1) time. By stacking dual MiniLM-L6-v2 models using a 32-token head/tail splice, the system detects toxicity and maps intent (Personal, Self, System) in just 2–12 milliseconds. The engine autonomously de-escalates conflicts by injecting target-aware placeholders, backed by a Lighthouse-optimized Angular v22 frontend, Zero Data Retention (ZDR) routing, and PayPro Global billing.',
      tech: 'AI, C# / .NET 10, Angular v22, Dual MiniLM-L6-v2, ONNX Runtime, OpenRouter (LLaMA-3.1), PayPro Global., Hetzner, Cloudflare',
    },
    {
      title: 'Enterprise CRM Transformation',
      description:
        'Transformed a legacy CRM into a modern, extensible Angular v22 product. Improved developer velocity and enabled rapid feature delivery.',
      result: 'Accelerated release cadence from monthly to weekly. Increased adoption by 25%.',
      tech: 'Angular v22, RxJS, NgRx, TypeScript',
    },
    {
      title: 'Scalable Azure Platform',
      description:
        'Built a cost-efficient backend to support rapid user growth. Partnered with product and ops to align costs with roadmap goals.',
      result: 'Supported 3× user growth without degradation. Reduced cloud costs by 30%.',
      tech: '.NET 10, Azure Functions, PostgreSQL, Storage Blobs',
    },
    {
      title: 'End-to-End Delivery',
      description:
        'Led cross-functional deliveries from concept to production — architecture, testing and monitoring — ensuring high quality.',
      result: 'Delivered multiple high-impact features on schedule, improving retention.',
      tech: 'Agile, CI/CD, Unit & E2E testing',
    },
  ]);

  readonly currentYear = signal(new Date().getFullYear());

  ngOnInit(): void {
    const baseUrl = this.document.location.origin;

    // --- BEST PRACTICE SEO ---
    this.titleService.setTitle('Anton.Po | Senior Full Stack .NET & Angular Developer');

    this.meta.addTags([
      // Description optimized to ~160 chars for Google SERP
      {
        name: 'description',
        content:
          'Senior Full Stack Developer specializing in Angular v22, .NET 10, and Azure. I deliver high-performance architecture for complex business needs.',
      },
      { name: 'author', content: 'Anton.Po' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' },

      // Open Graph (Facebook/LinkedIn)
      { property: 'og:title', content: 'Anton.Po - High-Performance Web Solutions' },
      {
        property: 'og:description',
        content: 'Building the next web with Angular v22 and .NET 10.',
      },
      { property: 'og:image', content: `${baseUrl}/assets/anton-po.webp` },
      { property: 'og:url', content: baseUrl },
      { property: 'og:type', content: 'website' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Anton.Po | .NET & Angular Architect' },
      {
        name: 'twitter:description',
        content: 'Building the next web with Angular v22 and .NET 10.',
      },
      { name: 'twitter:image', content: `${baseUrl}/assets/anton-po.webp` },
    ]);
  }
}
