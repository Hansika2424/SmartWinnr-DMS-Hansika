import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DocumentService } from '../../services/document.service';
import { User } from '../../models/user.model';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  documents: Document[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  selectedCategory = '';
  selectedTag = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalDocuments = 0;
  categories: string[] = [];
  allTags: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.error = '';

    this.documentService.getDocuments(
      this.currentPage,
      this.itemsPerPage,
      this.searchQuery,
      this.selectedTag,
      this.selectedCategory
    ).subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.totalPages = response.pagination.pages;
        this.totalDocuments = response.pagination.total;
        this.loading = false;
        this.extractCategoriesAndTags();
      },
      error: (error) => {
        this.error = 'Failed to load documents';
        this.loading = false;
      }
    });
  }

  extractCategoriesAndTags(): void {
    const categoriesSet = new Set<string>();
    const tagsSet = new Set<string>();

    this.documents.forEach(doc => {
      categoriesSet.add(doc.category);
      doc.tags.forEach(tag => tagsSet.add(tag));
    });

    this.categories = Array.from(categoriesSet).sort();
    this.allTags = Array.from(tagsSet).sort();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDocuments();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.currentPage = 1;
    this.loadDocuments();
  }

  filterByTag(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.currentPage = 1;
    this.loadDocuments();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedTag = '';
    this.currentPage = 1;
    this.loadDocuments();
  }

  deleteDocument(id: string, event: Event): void {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: () => {
          this.error = 'Failed to delete document';
        }
      });
    }
  }

  downloadDocument(id: string, title: string, event: Event): void {
    event.stopPropagation();

    this.documentService.downloadDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = title;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error = 'Failed to download document';
      }
    });
  }

  viewDocument(id: string): void {
    // Could open a modal or navigate to detail page
    this.router.navigate(['/documents', id]);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDocuments();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('zip')) return '📦';
    return '📎';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString();
  }

  isOwner(uploadedByUserId: string): boolean {
    return this.currentUser?.id === uploadedByUserId;
  }
}
