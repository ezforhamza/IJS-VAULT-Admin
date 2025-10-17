import { useQuery } from '@tanstack/react-query';

import legalService from '@/api/services/legalService';
import { Icon } from '@/components/icon';
import { useRouter } from '@/routes/hooks';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { Title, Text } from '@/ui/typography';

interface LegalPageProps {
  slug: string;
}

export default function LegalPage({ slug }: LegalPageProps) {
  const { push } = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['legal', slug],
    queryFn: () => legalService.getLegalPage(slug),
  });

  const handleEdit = () => {
    push(`/legal/${slug}/edit`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <Title as="h3" className="text-destructive mb-2">
                Error Loading Page
              </Title>
              <Text variant="body2" className="text-muted-foreground">
                Failed to load the legal page. Please try again later.
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <Title as="h3" className="mb-2">
                Page Not Found
              </Title>
              <Text variant="body2" className="text-muted-foreground">
                The requested legal page could not be found.
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Title as="h2" className="text-3xl font-bold">
                {data.title}
              </Title>
              <Text variant="body2" className="text-muted-foreground mt-2">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </div>
            <Button onClick={handleEdit} size="sm">
              <Icon icon="solar:pen-outline" size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Legal content is controlled and sanitized from backend */}
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="prose prose-sm max-w-none dark:prose-invert"
          />
        </CardContent>
      </Card>
    </div>
  );
}
