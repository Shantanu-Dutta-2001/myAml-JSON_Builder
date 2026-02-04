import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface VisitorData {
    visitorId: string;
    firstVisit: string;
    totalVisitors: number;
}

@Injectable({
    providedIn: 'root'
})
export class VisitorTrackingService {
    private readonly STORAGE_KEY = 'myaml_visitor_data';
    private visitorCountSubject: BehaviorSubject<number>;

    constructor() {
        const data = this.getVisitorData();
        this.visitorCountSubject = new BehaviorSubject<number>(data.totalVisitors);
        this.trackVisitor();
    }

    /**
     * Track the current visitor
     */
    trackVisitor(): void {
        const data = this.getVisitorData();

        if (!data.visitorId) {
            // New visitor - generate unique ID and increment count
            const newVisitorId = this.generateVisitorId();
            const newData: VisitorData = {
                visitorId: newVisitorId,
                firstVisit: new Date().toISOString(),
                totalVisitors: data.totalVisitors + 1
            };

            this.saveVisitorData(newData);
            this.visitorCountSubject.next(newData.totalVisitors);
        }
    }

    /**
     * Get the current visitor count as an observable
     */
    getVisitorCount$(): Observable<number> {
        return this.visitorCountSubject.asObservable();
    }

    /**
     * Get the current visitor count
     */
    getVisitorCount(): number {
        return this.visitorCountSubject.value;
    }

    /**
     * Generate a unique visitor ID based on browser fingerprint
     */
    private generateVisitorId(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const userAgent = navigator.userAgent;
        const screenRes = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Create a simple fingerprint
        const fingerprint = `${userAgent}-${screenRes}-${timezone}-${timestamp}-${random}`;

        // Generate a hash-like ID
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return `visitor_${Math.abs(hash)}_${timestamp}`;
    }

    /**
     * Get visitor data from localStorage
     */
    private getVisitorData(): VisitorData {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Error reading visitor data:', error);
        }

        return {
            visitorId: '',
            firstVisit: '',
            totalVisitors: 500
        };
    }

    /**
     * Save visitor data to localStorage
     */
    private saveVisitorData(data: VisitorData): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Error saving visitor data:', error);
        }
    }

    /**
     * Reset visitor tracking (for testing purposes)
     */
    resetTracking(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.visitorCountSubject.next(0);
    }
}
