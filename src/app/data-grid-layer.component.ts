import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  NgZone,
  afterNextRender,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Strict object shapes for V8 Engine optimization
interface GridNode {
  id: number;
  x: number;
  y: number;
}

// Zero-allocation Object Pool Class
class DataPacket {
  isActive: boolean = false;
  startX: number = 0;
  startY: number = 0;
  targetX: number = 0;
  targetY: number = 0;
  progress: number = 0;
  speed: number = 0;

  activate(start: GridNode, target: GridNode): void {
    this.isActive = true;
    this.startX = start.x;
    this.startY = start.y;
    this.targetX = target.x;
    this.targetY = target.y;
    this.progress = 0;

    // Pre-calculate fixed speed based on distance to ensure constant travel time
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.speed = 3.0 / Math.max(distance, 1); // 3.0 logical pixels per frame
  }

  deactivate(): void {
    this.isActive = false;
  }
}

@Component({
  selector: 'app-data-grid-layer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Split-Horizon Protocol: aria-hidden hides this entirely from Googlebot -->
    <!-- pointer-events-none ensures it never hijacks UI interactions -->
    <canvas
      #gridCanvas
      class="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      aria-hidden="true"
    >
    </canvas>
  `,
})
export class DataGridLayerComponent implements OnDestroy {
  @ViewChild('gridCanvas', { static: false })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private ctx: CanvasRenderingContext2D | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number = 0;

  // Cached logical dimensions for $O(1) vector mathematics
  private logicalWidth = 0;
  private logicalHeight = 0;

  // Pre-allocated Data Structures
  private readonly POOL_SIZE = 50;
  private readonly NODE_COUNT = 150;
  private readonly CONNECTION_DISTANCE = 180;

  private nodes: GridNode[] = [];
  private edges = new Map<number, number[]>(); // Adjacency List: NodeID -> TargetNodeIDs[]
  private readonly packetPool: DataPacket[] = [];

  // Phase 4: Offscreen Cache Pipeline
  private bgCache: HTMLCanvasElement | null = null;
  private bgCacheCtx: CanvasRenderingContext2D | null = null;

  constructor() {
    // SSR Split-Horizon Firewall
    // afterNextRender guarantees client-side execution, but we wrap it in
    // isPlatformBrowser as a strict NASA-level redundancy check to guarantee
    // absolutely zero crashes during Firebase SSR builds.
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.initializeEngine();
      });
    }
  }

  private initializeEngine(): void {
    // The Zone Bypass: Escaping Angular's Change Detection entirely
    this.ngZone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;

      // 'desynchronized: true' hints the browser compositor to reduce latency
      // by bypassing the standard double-buffering pipeline where possible.
      this.ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
      });

      if (!this.ctx) return;

      // Instantiate native ResizeObserver to replace expensive window event listeners
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === canvas) {
            this.recalculateDimensions(entry.contentRect.width, entry.contentRect.height);
          }
        }
      });

      // Initialize the Zero-Allocation Object Pool strictly ONCE
      for (let i = 0; i < this.POOL_SIZE; i++) {
        this.packetPool.push(new DataPacket());
      }

      // Observe the fixed canvas directly. It scales with the viewport.
      this.resizeObserver.observe(canvas);

      // Ignite the deterministic render loop
      this.frame();
    });
  }

  private recalculateDimensions(width: number, height: number): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;

    // High-DPI Retina Scaling calculation
    const dpr = window.devicePixelRatio || 1;

    this.logicalWidth = width;
    this.logicalHeight = height;

    // Scale physical resolution to prevent pixelation on 4K/Apple screens
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Normalize the coordinate system to strictly match CSS logical pixels
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Initialize or resize the Offscreen Cache (Zero DOM footprint)
    if (!this.bgCache) {
      this.bgCache = document.createElement('canvas');
      this.bgCacheCtx = this.bgCache.getContext('2d', { alpha: true });
    }

    // Scale cache to match the exact physical Retina display pixels
    this.bgCache.width = canvas.width;
    this.bgCache.height = canvas.height;
    if (this.bgCacheCtx) {
      this.bgCacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Rebuild the strict mathematical topology only when physical dimensions mutate
    this.buildNetworkTopology();

    // Paint the static architecture to the offscreen buffer
    this.cacheStaticArchitecture();
  }

  private buildNetworkTopology(): void {
    this.nodes = [];
    this.edges.clear();

    // 1. Generate Static Nodes
    for (let i = 0; i < this.NODE_COUNT; i++) {
      this.nodes.push({
        id: i,
        x: Math.random() * this.logicalWidth,
        y: Math.random() * this.logicalHeight,
      });
    }

    // 2. Pre-calculate Edges (Adjacency List) for O(1) runtime lookups
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      const connections: number[] = [];

      for (let j = 0; j < this.nodes.length; j++) {
        if (i === j) continue;
        const nodeB = this.nodes[j];

        // Pythagorean distance calculation
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;

        if (dx * dx + dy * dy < this.CONNECTION_DISTANCE * this.CONNECTION_DISTANCE) {
          connections.push(nodeB.id);
        }
      }
      this.edges.set(nodeA.id, connections);
    }
  }

  private firePulse(): void {
    if (this.nodes.length === 0) return;

    // O(1) array bound search (Fixed max 50 iterations)
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const packet = this.packetPool[i];

      if (!packet.isActive) {
        // O(1) random node selection
        const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        const neighbors = this.edges.get(startNode.id);

        if (neighbors && neighbors.length > 0) {
          const targetNodeId = neighbors[Math.floor(Math.random() * neighbors.length)];
          const targetNode = this.nodes[targetNodeId];

          packet.activate(startNode, targetNode);
        }
        return; // Exit after firing one pulse
      }
    }
  }

  private cacheStaticArchitecture(): void {
    if (!this.bgCacheCtx) return;
    const ctx = this.bgCacheCtx;

    // Clear previous cache state
    ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

    // 1. Draw Architectural Edges (executed ONLY on resize, O(N))
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 194, 255, 0.05)'; // Deep Corporate Azure, ultra-low opacity
    ctx.beginPath();

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const neighbors = this.edges.get(node.id);
      if (!neighbors) continue;

      for (let j = 0; j < neighbors.length; j++) {
        const targetNode = this.nodes[neighbors[j]];
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(targetNode.x, targetNode.y);
      }
    }
    ctx.stroke();

    // 2. Draw Server Nodes
    ctx.fillStyle = 'rgba(0, 194, 255, 0.15)'; // Faint glowing memory blocks
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private processActivePulses(): void {
    // Fire a new pulse randomly (~3% chance per frame)
    if (Math.random() < 0.03) {
      this.firePulse();
    }

    if (!this.ctx) return;
    const ctx = this.ctx;

    // O(1) mutation cycle. Render strictly active packets.
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const packet = this.packetPool[i];
      if (!packet.isActive) continue;

      packet.progress += packet.speed;

      if (packet.progress >= 1.0) {
        packet.deactivate();
        continue;
      }

      // Linear Interpolation (LERP) for current position
      const currentX = packet.startX + (packet.targetX - packet.startX) * packet.progress;
      const currentY = packet.startY + (packet.targetY - packet.startY) * packet.progress;

      // Tail calculation (trailing 15% behind the head)
      const tailProgress = Math.max(0, packet.progress - 0.15);
      const tailX = packet.startX + (packet.targetX - packet.startX) * tailProgress;
      const tailY = packet.startY + (packet.targetY - packet.startY) * tailProgress;

      // Render the Fiber Optic Packet
      const gradient = ctx.createLinearGradient(currentX, currentY, tailX, tailY);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Super-heated leading edge
      gradient.addColorStop(0.2, 'rgba(0, 194, 255, 0.8)'); // Azure core
      gradient.addColorStop(1, 'rgba(0, 194, 255, 0)'); // Fading quantum tail

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
  }

  private frame(): void {
    if (!this.ctx) return;

    // 1. Clear viewport ($O(1) composite operation)
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

    // 2. Render Pipeline Execution (Phase 4)
    if (this.bgCache) {
      // $O(1) instant GPU blast of the entire static network
      // We scale it back down to logical pixels during draw
      this.ctx.drawImage(this.bgCache, 0, 0, this.logicalWidth, this.logicalHeight);
    }

    // Calculate and paint strictly the active fiber optic pulses
    this.processActivePulses();

    // 3. Chain next frame deterministically
    this.rafId = requestAnimationFrame(() => this.frame());
  }

  ngOnDestroy(): void {
    // Deterministic Cleanup: Prevent memory and listener leaks during SPA route navigation
    if (isPlatformBrowser(this.platformId)) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      this.ctx = null;
    }
  }
}
