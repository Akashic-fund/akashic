import { Profile } from '@/types/profile';
import {
  Card,
  Avatar,
  AvatarFallback,
  CardContent,
  Button,
} from '@/components/ui';
import { UserRound, Pencil } from 'lucide-react';
import { FormattedDate } from '@/components/formatted-date';
import { useAuth } from '@/contexts';
export function ProfileCard({
  profile,
  onEdit,
}: {
  profile?: Profile;
  onEdit?: () => void;
}) {
  const { address } = useAuth();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarFallback>
              <UserRound className="h-20 w-20 rounded-full bg-green-100 p-4" />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold">
              {profile?.firstName || 'Anonymous User'}
              {profile?.lastName && ` ${profile?.lastName}`}
            </h2>
            <p className="break-all text-sm text-muted-foreground">
              Wallet: {address}
            </p>
            <p className="text-sm text-muted-foreground">
              Last login:{' '}
              {profile?.updatedAt ? (
                <FormattedDate date={profile.updatedAt} />
              ) : (
                'Never logged in'
              )}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" title="Edit" onClick={onEdit}>
              <Pencil />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
