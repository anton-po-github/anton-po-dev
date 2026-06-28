import {
  Component,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  TransferState,
  PLATFORM_ID,
  makeStateKey,
} from '@angular/core';
import { CommonModule, NgOptimizedImage, DOCUMENT, isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { DataGridLayerComponent } from './data-grid-layer.component';

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

const PORTFOLIO_SEO_KEY = makeStateKey<boolean>('anton-po-seo-rendered');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, DataGridLayerComponent],
  templateUrl: './app.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

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
    if (this.transferState.get(PORTFOLIO_SEO_KEY, false)) {
      return;
    }

    this.initializeSeoMetadata();
  }

  private initializeSeoMetadata(): void {
    const title = 'Anton.Po | Senior Full Stack .NET 10 & Angular 22 Architect';
    const description =
      'Senior Full Stack Software Architect specializing in extreme-performance Angular 22 SSR, .NET 10 backends, and O(1) algorithmic systems. Hire me on Upwork.';

    const baseUrl = 'https://anton-po.dev/';
    const ogImageUrl = `${baseUrl}assets/anton-po.webp`;

    this.titleService.setTitle(title);

    this.meta.addTags([
      { name: 'description', content: description },
      { name: 'author', content: 'Anton Postelniak' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:url', content: baseUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImageUrl },
    ]);

    this.setCanonicalUrl(baseUrl);
    this.injectJsonLdSchema(baseUrl, ogImageUrl);

    if (isPlatformServer(this.platformId)) {
      this.transferState.set(PORTFOLIO_SEO_KEY, true);
    }
  }

  private setCanonicalUrl(url: string): void {
    const head = this.document.head;
    let element: HTMLLinkElement | null =
      this.document.querySelector('link[rel="canonical"]') || null;

    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);
  }

  private injectJsonLdSchema(url: string, imageUrl: string): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': `${url}#webpage`,
          url: url,
          name: 'Anton Postelniak Portfolio',
          description: 'Technical portfolio and contract booking for Anton Postelniak.',
          mainEntity: { '@id': `${url}#person` },
        },

        {
          '@type': 'Person',
          '@id': `${url}#person`,
          name: 'Anton Postelniak',
          alternateName: 'Anton.Po',
          jobTitle: 'Senior Software Architect & Full Stack Developer',
          image: imageUrl,
          url: url,
          sameAs: [
            'https://github.com/anton-po-github',
            'https://www.upwork.com/freelancers/~0170d57a30eaf6251c',
          ],
          knowsAbout: [
            '.NET 10',
            'Angular 22',
            'Server-Side Rendering (SSR)',
            'C#',
            'Algorithmic Complexity O(1)',
            'Distributed Cloud Architecture',
            'PostgreSQL',
          ],
        },
      ],
    };

    const existingScript: HTMLScriptElement | null = this.document.head.querySelector(
      'script[type="application/ld+json"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
