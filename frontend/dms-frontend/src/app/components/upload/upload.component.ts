import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  error = '';
  success = false;
  tags: string[] = [];
  currentTag = '';
  uploadProgress = 0;

  categories = [
    'Uncategorized',
    'Work',
    'Personal',
    'Finance',
    'Legal',
    'Medical',
    'Education'
  ];

  allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      category: ['Uncategorized'],
      isPublic: [false]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (!this.allowedTypes.includes(file.type)) {
        this.error = 'File type not allowed. Please upload: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT, or ZIP files.';
        return;
      }

      if (file.size > 10485760) {
        this.error = 'File size exceeds 10MB limit';
        return;
      }

      this.selectedFile = file;
      this.error = '';

      // Auto-fill title from filename
      if (!this.uploadForm.get('title')?.value) {
        const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        this.uploadForm.patchValue({
          title: fileName
        });
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.onFileSelected({ target: { files } });
    }
  }

  addTag(): void {
    const tag = this.currentTag.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.currentTag = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.error = 'Please fill all required fields and select a file';
      return;
    }

    this.loading = true;
    this.error = '';
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('title', this.uploadForm.get('title')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);
    formData.append('category', this.uploadForm.get('category')?.value);
    formData.append('tags', JSON.stringify(this.tags));
    formData.append('isPublic', this.uploadForm.get('isPublic')?.value);
    formData.append('file', this.selectedFile);

    this.documentService.uploadDocument(formData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          this.uploadForm.reset();
          this.selectedFile = null;
          this.tags = [];

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Upload failed';
        }
      });
  }

  get f() {
    return this.uploadForm.controls;
  }
}
