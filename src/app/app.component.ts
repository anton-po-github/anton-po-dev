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
      title: 'Lead Architect & Full Stack Engineer',
      company: 'DeepVide',
      url: 'https://deepvide.com/',
      result: '',
      description:
        'Architected and engineered a dedicated educational operating system that transforms YouTube into a distraction-free learning workspace. Developed a high-performance .NET 10 backend with hybrid batching workers for metadata ingestion, paired with a zoneless Angular v22 SSR client. Engineered a strict O(1) constant-time semantic knowledge search pipeline that tokenizes transcript data into high-speed memory structures, enabling instant cross-video concept retrieval without timeline scrubbing. The platform neutralizes algorithmic rabbit holes and provides interactive execution workspaces for advanced technical upskilling.',
      tech: 'C# / .NET 10, Angular v22, YouTube Data API v3, SSR, O(1) Memory Indexing, TypeScript, Tailwind CSS',
    },

    {
      title: 'Senior Angular & .NET Engineer (Long-Term Engagement)',
      company: 'Upwork, one client since 2020',
      url: '123',
      result: '',
      // '6,256 hours with one client over 5+ years. Rated 4.8/5. Top Rated Plus, 100% Job Success.',
      description:
        'Front-end and full-stack engineer for one client\'s Angular SPA since October 2020. The contract is still active after more than 6,000 hours, which only happens when the work stays reliable year after year. The client\'s review calls me "hardworking, honest and talented". Across 21 Upwork jobs I have logged 8,700+ hours, with 10+ years in front-end and 5+ years in back-end development, delivering enterprise-grade Angular and .NET applications.',
      tech: 'Angular, TypeScript, RxJS, C# / .NET, ASP.NET Web API, Entity Framework, Azure, CI/CD (GitHub Actions)',
    },
    {
      title: 'Main Full-Stack Developer (Codebase Takeover)',
      company: 'Online Survey Platform (client project)',
      url: '123',
      result: '',
      //'Took over a large .NET project, moved it from MS SQL to PostgreSQL, and deployed a working beta on a custom domain in Dec 2025.',
      description:
        'Brought in to take over a SurveyMonkey-style platform with errors and unmerged branches. I got both projects running, then made the core engineering decisions myself. I moved the large .NET backend from MS SQL Server to PostgreSQL by switching EF Core to the Npgsql provider and rebuilding the schema (25 tables) from a fresh initial migration. I built the authentication flow (JWT, server-side reCAPTCHA verification, password change by email), the Survey Builder with Matrix and NPS question types, and Arabic/English i18n with full RTL/LTR support. I upgraded the stack to .NET 10 and Angular 22 with Material 3 theming, and set up the beta deployment end to end: Firebase Hosting, Azure App Service, Supabase PostgreSQL, Redis on Upstash, and Cloudflare DNS.',
      tech: 'C# / .NET 10, ASP.NET Web API, EF Core 10, Npgsql, PostgreSQL, Angular 22, Angular Material 3, Tailwind CSS, Redis, Azure, Firebase',
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
