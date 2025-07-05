import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type EmailSuggestion } from "@/services/email-generator";
import {
    AlertCircle,
    Check,
    Copy,
    Edit,
    Mail,
    MessageSquare,
    Send,
    User,
    X
} from "lucide-react";
import { useState } from "react";

interface EmailSuggestionProps {
  suggestion: EmailSuggestion;
  taskTitle: string;
  onClose: () => void;
  onSend?: (emailData: { to: string; subject: string; body: string }) => void;
}

export function EmailSuggestionCard({ suggestion, taskTitle, onClose, onSend }: EmailSuggestionProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState(suggestion.subject);
  const [body, setBody] = useState(suggestion.body);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string, type: 'subject' | 'body' | 'all') => {
    let textToCopy = '';
    
    if (type === 'subject') {
      textToCopy = subject;
    } else if (type === 'body') {
      textToCopy = body;
    } else {
      textToCopy = `Subject: ${subject}\n\n${body}`;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSend = () => {
    if (onSend && recipient.trim()) {
      onSend({
        to: recipient,
        subject,
        body
      });
      onClose();
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'formal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'professional': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'friendly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Email Suggestion
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getToneColor(suggestion.tone)}>
              {suggestion.tone}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Generated for: {taskTitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Points */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Key Points</span>
          </div>
          <div className="space-y-1">
            {suggestion.keyPoints.map((point, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                • {point}
              </div>
            ))}
          </div>
        </div>

        {/* Recipient Input */}
        <div className="space-y-2">
          <Label htmlFor="recipient" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Recipient Email
          </Label>
          <Input
            id="recipient"
            type="email"
            placeholder="recipient@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subject">Subject</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('', 'subject')}
              className="h-6 px-2"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          {isEditing ? (
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          ) : (
            <div className="p-3 bg-background/50 rounded-md border border-border/50 text-sm">
              {subject}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Email Body</Label>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-6 px-2"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('', 'body')}
                className="h-6 px-2"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>
          {isEditing ? (
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          ) : (
            <div className="p-3 bg-background/50 rounded-md border border-border/50 text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
              {body}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => handleCopy('', 'all')}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
          <Button
            onClick={handleSend}
            disabled={!recipient.trim()}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Tips</span>
          </div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
            <div>• Review and customize the email before sending</div>
            <div>• Replace [Recipient Name] and [Your Name] with actual names</div>
            <div>• Add any specific details or context as needed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 