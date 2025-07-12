'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import useAuthStore from '@/store/authStore';
import { apiService } from '@/utils/apiService';

export default function QuestionForm() {
  const { user, getToken } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      await apiService.createQuestion(formData, token);
      setSuccess('Question submitted successfully! It will be reviewed by our admin team.');
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        tags: []
      });
    } catch (err) {
      setError('Failed to submit question. Please try again.');
      console.error('Error submitting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
        <CardDescription>
          Submit your question for admin review. Once approved, it will be visible to the community.
          Use the rich editor to include code, images, and multimedia content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Question Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's your programming question? Be specific."
              maxLength={200}
              required
            />
            <p className="text-sm text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Question Content with Markdown Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Question Details *</Label>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Provide detailed information about your question. Include code examples, error messages, and what you've tried so far. You can upload images and videos directly!"
              height={500}
            />
            <p className="text-sm text-muted-foreground">
              Use markdown formatting. Upload images/videos directly or paste URLs. Be as detailed as possible.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags * (Max 5)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag (e.g., javascript, react, nodejs)"
                disabled={formData.tags.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || formData.tags.length >= 5}
                variant="outline"
              >
                Add
              </Button>
            </div>
            
            {/* Display Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Add relevant tags to help others find your question. Press Enter or click Add.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
