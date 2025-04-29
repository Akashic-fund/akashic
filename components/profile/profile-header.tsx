import { Separator } from "@/components/ui/" 

export function ProfileHeader() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-base text-muted-foreground">
                    Manage your account settings, KYC verification, and payment methods.
                </p>
            </div>
            <Separator />
        </div>
    )
} 