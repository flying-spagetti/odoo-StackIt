'use client';

import { useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image, Video, Link, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  height = 400 
}: MarkdownEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', file.name, file.type, file.size);
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Validate file before upload
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/mov'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || `Upload failed with status ${response.status}`);
      }

      if (!result.url) {
        throw new Error('No URL returned from upload service');
      }

      // Insert the uploaded media into the markdown
      let markdownInsert = '';
      
      if (result.resourceType === 'image' || file.type.startsWith('image/')) {
        markdownInsert = `![${file.name}](${result.url})`;
      } else if (result.resourceType === 'video' || file.type.startsWith('video/')) {
        markdownInsert = `<video controls width="100%" style="max-width: 600px;">
  <source src="${result.url}" type="${file.type}">
  Your browser does not support the video tag.
</video>`;
      } else {
        markdownInsert = `[${file.name}](${result.url})`;
      }

      // Insert at the end with proper spacing
      const newValue = value + (value ? '\n\n' : '') + markdownInsert + '\n\n';
      onChange(newValue);
      setUploadSuccess(`${file.type.startsWith('image/') ? 'Image' : 'File'} uploaded successfully!`);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      
      // If Cloudinary isn't configured, show helpful message
      if (errorMessage.includes('Cloudinary not configured')) {
        setUploadError('Media upload is not configured. Please add Cloudinary credentials to continue.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:') || 'Link';
    
    if (url) {
      const linkMarkdown = `[${text}](${url})`;
      onChange(value + (value ? ' ' : '') + linkMarkdown);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    const alt = prompt('Enter alt text:') || 'Image';
    
    if (url) {
      const imageMarkdown = `![${alt}](${url})`;
      onChange(value + (value ? '\n\n' : '') + imageMarkdown + '\n\n');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2 hover:bg-white transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload Media'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertImage}
          className="gap-2 hover:bg-white transition-colors"
        >
          <Image className="h-4 w-4" />
          Image URL
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertLink}
          className="gap-2 hover:bg-white transition-colors"
        >
          <Link className="h-4 w-4" />
          Add Link
        </Button>

        <div className="text-sm text-muted-foreground ml-auto">
          Supports: Images (JPG, PNG, GIF, WebP), Videos (MP4, WebM)
        </div>
      </div>

      {/* Upload Status */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{uploadSuccess}</AlertDescription>
        </Alert>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Markdown Editor */}
      <div data-color-mode="light" className="rounded-xl overflow-hidden border">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="edit"
          hideToolbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: 'var(--font-roboto), monospace',
            },
          }}
        />
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Markdown Quick Reference:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-800">
          <div><code>**bold**</code> → <strong>bold text</strong></div>
          <div><code>*italic*</code> → <em>italic text</em></div>
          <div><code>`code`</code> → inline code</div>
          <div><code>```js</code> → code blocks</div>
          <div><code>- item</code> → bullet lists</div>
          <div><code>| col |</code> → tables</div>
        </div>
      </div>
    </div>
  );
}
